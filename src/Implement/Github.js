import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase-config";
import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const API_BASE = "https://taskflow-api.istad.co";

export const useLogin = () => {
  const [error, setError] = useState(null); // kept for compatibility, stays null
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  const provider = new GithubAuthProvider();
  // get primary + private emails if available
  provider.addScope("user:email");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  // -------- helpers (no throws -> smooth UI) --------
  const safeParseJSON = (text) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  // POST helper -> { ok:boolean, status:number, data:any }
  const postJSON = async (url, body, { timeoutMs = 15000 } = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // uncomment if API uses cookies/sessions
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.text().catch(() => "");
      const data = safeParseJSON(text);
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      console.error("postJSON error:", e); // silent for UI
      return { ok: false, status: 0, data: null };
    } finally {
      clearTimeout(timer);
    }
  };

  // Normalize GitHub user -> backend payload
  const buildIdentity = (ghUser) => {
    const uid = ghUser?.uid || "";
    const email = ghUser?.email || `${uid}@github.local`; // fallback if GH hides email
    const base =
      ghUser?.displayName?.trim() ||
      (email.includes("@") ? email.split("@")[0] : `gh_${uid.slice(0, 8)}`);
    const username =
      base.replace(/\W+/g, "_").slice(0, 20) || `gh_${uid.slice(0, 8)}`;
    const password = uid; // dummy password to pair with your API
    return { email, username, password };
  };

  // Login first; if not found -> Register; if register no accessToken -> Re-login once
  const authenticateWithBackend = async (ghUser) => {
    const { email, username, password } = buildIdentity(ghUser);

    // 1) /login
    const login1 = await postJSON(`${API_BASE}/login`, { email, password });
    if (login1.ok) {
      return {
        accessToken:
          login1.data?.accessToken ??
          login1.data?.access_token ??
          login1.data?.jwt ??
          null,
        user: login1.data?.user ?? null,
      };
    }

    // 2) /register on common statuses
    if ([401, 404, 409, 422].includes(login1.status)) {
      const reg = await postJSON(`${API_BASE}/register`, {
        username,
        email,
        password,
        confirmed_password: password,
        password_confirmation: password,
      });

      if (reg.ok) {
        if (reg.data?.accessToken || reg.data?.access_token || reg.data?.jwt) {
          return {
            accessToken:
              reg.data.accessToken ??
              reg.data.access_token ??
              reg.data.jwt ??
              null,
            user: reg.data?.user ?? null,
          };
        }
        // 3) if register ok but no accessToken -> login once
        const login2 = await postJSON(`${API_BASE}/login`, { email, password });
        if (login2.ok) {
          return {
            accessToken:
              login2.data?.accessToken ??
              login2.data?.access_token ??
              login2.data?.jwt ??
              null,
            user: login2.data?.user ?? null,
          };
        }
      } else {
        // register 5xx? try login once more silently
        if (reg.status >= 500) {
          const login3 = await postJSON(`${API_BASE}/login`, {
            email,
            password,
          });
          if (login3.ok) {
            return {
              accessToken:
                login3.data?.accessToken ??
                login3.data?.access_token ??
                login3.data?.jwt ??
                null,
              user: login3.data?.user ?? null,
            };
          }
        }
      }
    }

    // other errors/network -> silent
    return { accessToken: null, user: null };
  };

  const login = async () => {
    setError(null); // stays silent
    setIsPending(true);
    try {
      // GitHub popup
      const result = await signInWithPopup(auth, provider);
      if (!result) return;

      // Backend auth (login-first with register fallback)
      const { accessToken, user: backendUser } = await authenticateWithBackend(
        result.user
      );
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // unify with your other hooks
      }

      setUser({ ...result.user, ...(backendUser || {}) });
    } catch (e) {
      console.error("GitHub login error:", e); // keep UI silent
      // do NOT set error message
    } finally {
      setIsPending(false);
    }
  };

  const logout = async () => {
    setError(null);
    setIsPending(true);
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("app_token"); // clean up old key if used elsewhere
      setUser(null);
    } catch (e) {
      console.error("GitHub logout error:", e); // keep UI silent
      // do NOT set error message
    } finally {
      setIsPending(false);
    }
  };

  return { login, logout, user, error, isPending };
};
