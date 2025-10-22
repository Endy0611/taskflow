import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase-config";
import {
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const API_BASE = "https://taskflow-api.istad.co";

export const useLoginWithFacebook = () => {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const provider = new FacebookAuthProvider();
  // Make sure your Facebook app has the "email" permission approved
  provider.addScope("email");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // ---------- helpers (no throws to keep UI smooth) ----------
  const safeParseJSON = (text) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  // POST helper -> returns { ok, status, data }
  const postJSON = async (url, body, { timeoutMs = 15000 } = {}) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // uncomment if API uses cookies
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.text().catch(() => "");
      return { ok: res.ok, status: res.status, data: safeParseJSON(text) };
    } catch (e) {
      console.error("postJSON error:", e); // silent for UI
      return { ok: false, status: 0, data: null };
    } finally {
      clearTimeout(t);
    }
  };

  // Normalize FB user into backend-friendly fields
  const buildIdentity = (fbUser) => {
    const uid = fbUser?.uid || "";
    const rawEmail = fbUser?.email;
    // Fallback email if FB doesn't return one
    const email = rawEmail || `${uid}@facebook.local`;
    // Username: displayName -> email local-part -> fallback
    const baseName =
      fbUser?.displayName?.trim() ||
      (email.includes("@") ? email.split("@")[0] : `fb_${uid.slice(0, 8)}`) ||
      `fb_${uid.slice(0, 8)}`;

    // Sanitize + clamp
    const username =
      baseName.replace(/\W+/g, "_").slice(0, 20) || `fb_${uid.slice(0, 8)}`;
    const password = uid; // dummy password

    return { email, username, password };
  };

  // Login first; on 401/404/409/422 -> register; if register returns no accessToken -> re-login once
  const authenticateWithBackend = async (fbUser) => {
    const { email, username, password } = buildIdentity(fbUser);

    // 1) LOGIN
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

    // 2) REGISTER on common "not found" statuses
    if ([401, 404, 409, 422].includes(login1.status)) {
      const reg = await postJSON(`${API_BASE}/register`, {
        username,
        email,
        password,
        confirmed_password: password, // some APIs expect this
        password_confirmation: password, // some expect this instead
      });

      if (reg.ok) {
        // Some APIs return accessToken directly on register
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
        // 3) No accessToken? Try login once
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
        // Register 500? Could be server-side validation. Try login one more time silently.
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

    // Other cases (network/CORS/5xx) -> silent fallback
    return { accessToken: null, user: null };
  };

  const facebookLogin = async () => {
    setIsPending(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result) return;

      const { accessToken, user: backendUser } = await authenticateWithBackend(
        result.user
      );
      if (accessToken) localStorage.setItem("accessToken", accessToken);

      // Keep Firebase session regardless of backend status
      setUser({ ...result.user, ...(backendUser || {}) });
    } catch (e) {
      console.error("Facebook login error:", e); // silent for UI
    } finally {
      setIsPending(false);
    }
  };

  const logout = async () => {
    setIsPending(true);
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e); // silent
    } finally {
      setIsPending(false);
    }
  };

  return { facebookLogin, logout, user, isPending };
};
