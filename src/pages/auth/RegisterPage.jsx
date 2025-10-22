import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
const registerImage = "/assets/general/register-pic.png";

import { z } from "zod";
import { useNavigate } from "react-router-dom";

// Zod schema for register validation
const registerSchema = z
  .object({
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Helper functions
const firstError = (d) => {
  if (!d) return null;
  if (typeof d === "string") return d;
  if (typeof d?.message === "string") return d.message;
  if (typeof d?.error === "string") return d.error;
  if (d?.errors && typeof d.errors === "object") {
    const k = Object.keys(d.errors)[0];
    const v = d.errors[k];
    return Array.isArray(v) ? v[0] : String(v);
  }
  return null;
};

const isEmail = (v) => /\S+@\S+\.\S+/.test(String(v || ""));
const sanitizeUsername = (u) =>
  String(u || "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .toLowerCase()
    .slice(0, 32) || "";
const passwordStrong = (p) =>
  typeof p === "string" &&
  p.length >= 8 &&
  /[A-Z]/.test(p) &&
  /[a-z]/.test(p) &&
  /\d/.test(p) &&
  /[^A-Za-z0-9]/.test(p);

const normalizeGender = (g) => {
  const v = String(g || "")
    .trim()
    .toLowerCase();
  if (["male", "m"].includes(v)) return "MALE";
  if (["female", "f"].includes(v)) return "FEMALE";
  return "OTHER";
};

const safeParseJSON = async (res) => {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
};

// RegisterPage Component
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    gender: "",
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const cleanUsername = useMemo(
    () => sanitizeUsername(formData.username),
    [formData.username]
  );
  const cleanEmail = useMemo(
    () =>
      String(formData.email || "")
        .trim()
        .toLowerCase(),
    [formData.email]
  );

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setFormData((p) => ({ ...p, username: sanitizeUsername(value) }));
    } else if (name === "email") {
      setFormData((p) => ({ ...p, email: value.trim() }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    const f = formData;
    if (
      !f.givenName ||
      !f.familyName ||
      !f.gender ||
      !cleanUsername ||
      !cleanEmail ||
      !f.password ||
      !f.confirmedPassword
    )
      return "Please fill in all fields.";
    if (!isEmail(cleanEmail)) return "Please enter a valid email address.";
    if (isEmail(formData.username))
      return "Username cannot be an email address.";
    if (cleanUsername.length < 3)
      return "Username must be at least 3 characters (letters, numbers, . or _).";
    if (!passwordStrong(f.password))
      return "Password must be 8+ chars with upper, lower, digit and symbol.";
    if (f.password !== f.confirmedPassword) return "Passwords don't match.";
    if (!["Male", "Female", "Other"].includes(f.gender))
      return "Gender must be Male, Female or Other.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setOkMsg("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "";
      const REGISTER_PATH =
        import.meta.env.VITE_REGISTER_PATH || "/auth/register";
      const res = await fetch(`${API_BASE}${REGISTER_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization token needed for registration
        },
        credentials: "omit", // Ensure credentials aren't included unless needed
        body: JSON.stringify({
          username: cleanUsername,
          email: cleanEmail,
          password: formData.password,
          confirmedPassword: formData.confirmedPassword,
          familyName: formData.familyName,
          givenName: formData.givenName,
          gender: normalizeGender(formData.gender),
        }),
      });

      const data = await safeParseJSON(res);

      if (res.ok) {
        setOkMsg(`Account created. You can now log in as "${cleanUsername}".`);
        setFormData((p) => ({ ...p, password: "", confirmedPassword: "" }));
        // Redirect to login page after success
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const msg =
          firstError(data) ||
          (res.status === 409 && "Email or username already in use.") ||
          (res.status === 422 && "Invalid data. Please check all fields.") ||
          (res.status === 400 && "Bad request. Please review your inputs.") ||
          (res.status === 500 &&
            "Server error while creating account. Try again later.") ||
          `Registration failed (HTTP ${res.status}).`;
        setError(msg);
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl bg-white shadow-xl overflow-hidden md:m-20">
        {/* Left image section */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-500 relative">
          <img
            src={registerImage}
            alt="Register Illustration"
            className="w-[650px] max-w-md object-contain drop-shadow-xl"
          />
        </div>

        {/* Right form section */}
        <div className="flex-1 flex items-center justify-center p-12 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Register title + subtitle */}
            <div className="flex flex-col items-center mb-8">
              <button className="pb-2 text-primary text-3xl font-medium">
                Register
              </button>
              <p className="mt-2 text-md text-gray-500">
                Create new Account to use cool template
              </p>
            </div>

            {/* Error / Success Messages */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {okMsg && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                {okMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <input
                name="givenName"
                value={formData.givenName}
                onChange={handleChange}
                disabled={loading}
                placeholder="First Name"
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-gray-700"
                required
              />
              <input
                name="familyName"
                value={formData.familyName}
                onChange={handleChange}
                disabled={loading}
                placeholder="Last Name"
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-gray-700"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-gray-700"
                required
              >
                <option value="" disabled className="text-gray-400">
                  Select your gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                {/* <option value="Other">Other</option> */}
              </select>
              <input
                name="username"
                value={cleanUsername}
                onChange={handleChange}
                disabled={loading}
                placeholder="Username"
                autoComplete="username"
                required
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-gray-700"
              />
              <input
                type="email"
                name="email"
                value={cleanEmail}
                onChange={handleChange}
                disabled={loading}
                placeholder="Email"
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-gray-700"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Password"
                  className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 pr-12 text-gray-700"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmedPassword"
                  value={formData.confirmedPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Confirm Password"
                  className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 pr-12 text-gray-700"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-70"
              >
                {loading ? "Processing…" : "Sign Up"}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
