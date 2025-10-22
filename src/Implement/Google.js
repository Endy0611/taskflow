import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase-config";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const API_BASE = "https://taskflow-api.istad.co";

export const useLoginWithGoogle = () => {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const provider = new GoogleAuthProvider();
  provider.addScope("email"); // ensure email if possible

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // ---- helpers (silent) ----
  const safeParseJSON = (text) => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  // Always returns { ok, status, data }
  const postJSON = async (url, body, { timeoutMs = 15000 } = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.text().catch(() => "");
      const data = safeParseJSON(text);
      return { ok: res.ok, status: res.status, data };
    } catch {
      return { ok: false, status: 0, data: null };
    } finally {
      clearTimeout(timer);
    }
  };

  // Safe identity: valid email + strong dummy password
  const buildIdentity = (gUser) => {
    const uid = gUser?.uid || String(Date.now());
    const email =
      gUser?.email && /\S+@\S+\.\S+/.test(gUser.email)
        ? gUser.email
        : `${uid}@example.com`;
    const base = (
      gUser?.displayName ||
      (email.includes("@") ? email.split("@")[0] : `gg_${uid.slice(0, 8)}`)
    ).trim();
    const username =
      base.replace(/\W+/g, "_").slice(0, 20) || `gg_${uid.slice(0, 8)}`;
    let password = `${uid}-Gg!2025`;
    if (password.length < 12) password = (password + "A1!").padEnd(12, "X");
    return { email, username, password };
  };

  // Login → Register on common statuses → Re-login once if needed
  const authenticateWithBackend = async (gUser) => {
    const { email, username, password } = buildIdentity(gUser);

    // 1) login
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

    // 2) register if typical "not found / conflict / unprocessable"
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
        // 3) register ok but no accessToken → try login once
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
      } else if (reg.status >= 500) {
        // server hiccup → try one more login silently
        const login3 = await postJSON(`${API_BASE}/login`, { email, password });
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

    return { accessToken: null, user: null };
  };

  const googleLogin = async () => {
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) return;

      const { accessToken, user: backendUser } = await authenticateWithBackend(
        res.user
      );
      if (accessToken) localStorage.setItem("accessToken", accessToken);

      setUser({ ...res.user, ...(backendUser || {}) });
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
    } finally {
      setIsPending(false);
    }
  };

  return { googleLogin, logout, user, isPending };
};
