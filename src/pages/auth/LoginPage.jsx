// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { http } from "../../services/http";

const loginImage = "/assets/general/Login-pic.png";


import {
  auth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "../../Implement/firebase/firebase-config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";

import { z } from "zod";

/* ---------------- env + utils ---------------- */
const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "";
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || "/auth/login";


const loginSchema = z.object({
  username: z.string().min(3, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const safeParseJSON = async (res) => {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
};

/* ---------------- component ---------------- */
export default function LoginPage() {
  // 🚀 Auto-redirect if already logged in

  const navigate = useNavigate();
  useEffect(() => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  if (role === "admin") {
    navigate("/admin");
  } else if (token) {
    navigate("/board");
  }
}, [navigate]);

  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const google = new GoogleAuthProvider();
  const github = new GithubAuthProvider();
  github.addScope("user:email");
  const facebook = new FacebookAuthProvider();
  facebook.addScope("email");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  async function applyPersistence(rememberMe) {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  }

  /* ---------------- USERNAME + PASSWORD ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Step 1️⃣: Login to get token
      const res = await fetch(`${API_BASE}${LOGIN_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
        credentials: "omit",
      });

      const data = await safeParseJSON(res);
      // console.log("✅ Login response:", data);

      if (!res.ok || !data?.accessToken) {
        setMessage(data?.message || "Login failed. Check your credentials.");
        return;
      }

      // Step 2️⃣: Save tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("auth_token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refresh_token", data.refreshToken);
      }

      // Step 3️⃣: Fetch user info using username to get user_id
      const userRes = await http.get(
        `/users/search/findByUsername?username=${form.username}`
      );
      // console.log("👤 User info:", userRes);

      // Extract userId from direct field or from _links.self.href
      let userId = userRes?.id || userRes?._embedded?.users?.[0]?.id;

      // If no direct id, try to parse from _links.self.href
      if (!userId && userRes?._links?.self?.href) {
        const href = userRes._links.self.href;
        const match = href.match(/\/users\/(\d+)/);
        if (match) userId = match[1];
      }

      if (!userId) {
        console.error("⚠️ User object does not contain id:", userRes);
        throw new Error("Cannot detect user_id from response");
      }

      localStorage.setItem("user_id", String(userId));
      localStorage.setItem("username", form.username);

      window.dispatchEvent(new Event("userLoggedIn"));

      // Step 4️⃣: Get all workspaces for that user
      const wsRes = await http.get(`/user-workspaces/${userId}`);
      // console.log("🏢 User workspaces:", wsRes);

      const workspaces = Array.isArray(wsRes)
        ? wsRes
        : wsRes?.content ||
          wsRes?._embedded?.workspaces ||
          Object.values(wsRes || {}).filter((x) => x?.id);

      // Step 5️⃣: Role-based redirect (frontend-only logic)
      if (form.username === "taskflowAdmin") {
        // ✅ Admin login shortcut (frontend role assignment)
        localStorage.setItem("role", "admin");
        setMessage("Welcome back, Admin!");
        navigate("/admin");
        return;
      } else {
        // Default user role
        localStorage.setItem("role", "user");
      }

      // Step 6️⃣: Redirect based on workspace availability
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        const first = workspaces[0];
        localStorage.setItem("current_workspace_id", String(first.id));
        localStorage.setItem("current_workspace_name", first.name || "");
        localStorage.setItem("current_workspace_theme", first.theme || "");
        localStorage.setItem("last_workspace", JSON.stringify(first));
        navigate(`/board/${first.id}`);
      } else {
        localStorage.setItem("open_create_workspace", "true");
        navigate("/board");
      }

      setMessage("Login successful! Redirecting...");
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(
        err?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- SOCIAL LOGIN ---------------- */
  async function handleOAuth(which) {
    setMessage("");
    setLoading(true);

    try {
      await applyPersistence(remember);
      let provider;

      if (which === "Google") provider = google;
      if (which === "Facebook") provider = facebook;
      if (which === "GitHub") provider = github;

      // OAuth login
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔄 Try exchanging Firebase ID token for backend token
      await saveBackendTokenFromFirebaseUser(user);

      // If the email exists with a different provider, link accounts
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      if (methods.length && !methods.includes(provider.providerId)) {
        const pendingCred = result.credential;
        const existingProviderId = methods[0];
        let existingProvider;

        if (existingProviderId === "google.com") existingProvider = google;
        if (existingProviderId === "facebook.com") existingProvider = facebook;
        if (existingProviderId === "github.com") existingProvider = github;

        const linkedResult = await signInWithPopup(auth, existingProvider);
        await linkWithCredential(linkedResult.user, pendingCred);

        // Ensure token saved after linking as well
        await saveBackendTokenFromFirebaseUser(linkedResult.user);

        localStorage.setItem(
          "user",
          JSON.stringify({
            name: linkedResult.user.displayName || "User",
            email: linkedResult.user.email,
            photoURL: linkedResult.user.photoURL || null,
            provider: linkedResult.providerId,
          })
        );

        setMessage("Accounts linked successfully!");
        setTimeout(() => navigate("/homeuser"), 800);
      } else {
        // Normal flow
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: user.displayName || "User",
            email: user.email,
            photoURL: user.photoURL || null,
            provider: result.providerId,
          })
        );

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/homeuser"), 800);
      }
    } catch (err) {
      console.error(`${which} OAuth error:`, err);
      const code = err.code;

      if (code === "auth/account-exists-with-different-credential") {
        const email = err.customData?.email;
        const pendingCred = err.credential;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length) {
          const existingProviderId = methods[0];
          let existingProvider;
          if (existingProviderId === "google.com") existingProvider = google;
          if (existingProviderId === "facebook.com")
            existingProvider = facebook;
          if (existingProviderId === "github.com") existingProvider = github;

          const linkedResult = await signInWithPopup(auth, existingProvider);
          await linkWithCredential(linkedResult.user, pendingCred);

          // Save tokens after linking
          await saveBackendTokenFromFirebaseUser(linkedResult.user);

          setMessage("Accounts linked successfully!");
          setTimeout(() => navigate("/homeuser"), 800);
        }
      } else {
        setMessage(err.message || "Social login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Helper: exchange Firebase ID token for backend token (or fallback to ID token)
  async function saveBackendTokenFromFirebaseUser(user) {
    try {
      const idToken = await user.getIdToken();
      // If your backend supports Firebase authentication exchange:
      const r = await fetch(`${API_BASE}/auth/firebase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "omit",
      });
      const apiData = await r.json().catch(() => null);

      const token =
        (r.ok && (apiData?.accessToken || apiData?.token || apiData?.jwt)) ||
        idToken;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("accessToken", token);
      if (apiData?.refreshToken) {
        localStorage.setItem("refresh_token", apiData.refreshToken);
      }
      if (apiData?.user) {
        localStorage.setItem("auth_user", JSON.stringify(apiData.user));
      }
    } catch {
      // As a safe fallback, at least store Firebase ID token
      const idToken = await user.getIdToken();
      localStorage.setItem("auth_token", idToken);
      localStorage.setItem("accessToken", idToken);
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#1E40AF] flex justify-center items-center">
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-center w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Illustration */}
        <img
          src={loginImage}
          alt="Login Illustration"
          className="hidden lg:block lg:w-[500px] max-w-sm object-contain mr-0 lg:mr-12 mb-6 lg:mb-0"
        />

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-white/70">Log in to continue</p>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-xl p-3 text-sm ${
                message.toLowerCase().includes("success")
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border border-red-500/30 bg-red-500/10 text-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <label className="block">
              <span className="mb-1.5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
                <Mail className="h-4 w-4" /> Username
              </span>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/40"
                autoComplete="username"
                required
              />
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1.5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
                <Lock className="h-4 w-4" /> Password
              </span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-white/50 outline-none transition focus:border-white/40"
                  autoComplete="current-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-white/80">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-white focus:ring-white/50"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-white/80 underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-3 font-semibold text-gray-900 shadow-lg shadow-black/20 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-transparent" />
                  Logging in…
                </span>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          {/* Social logins */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs text-white/60">OR</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <div className="flex text-white">
            <button
              onClick={() => handleOAuth("Google")}
              disabled={loading}
              className="flex flex-col w-full md:w-1/3 items-center justify-center gap-3"
            >
              <FcGoogle className="h-12 w-12" />
              <span className="text-sm font-medium">Google</span>
            </button>

            <button
              onClick={() => handleOAuth("Facebook")}
              disabled={loading}
              className="flex flex-col w-full md:w-1/3 items-center justify-center gap-3"
            >
              <FaFacebook className="h-12 w-12 text-blue-400 bg-white rounded-full" />
              <span className="text-sm font-medium">Facebook</span>
            </button>

            <button
              onClick={() => handleOAuth("GitHub")}
              disabled={loading}
              className="flex flex-col w-full md:w-1/3 items-center justify-center gap-3"
            >
              <FaGithub className="h-12 w-12 text-black bg-white rounded-full" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/70">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
        {/*  */}
      </div>
    </div>
  );
}
