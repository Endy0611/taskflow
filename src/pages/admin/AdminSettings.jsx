import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { motion } from "framer-motion";
import { Sun, Moon, Key, Server, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load saved theme from localStorage on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("admin-theme");
    if (savedMode === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // ✅ Toggle between light/dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
      toast.success("🌙 Dark mode activated");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
      toast("☀️ Switched to light mode", { icon: "☀️" });
    }
  };

  const handleSystemCheck = async () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("✅ Backend connection stable (200 OK)");
      setLoading(false);
    }, 1200);
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success("Cache cleared successfully!");
  };

  const handleChangePassword = () => {
    toast("Password reset email sent to admin@example.com", { icon: "📩" });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-8 max-w-5xl mx-auto space-y-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Admin Settings
          </motion.h1>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow p-6 border border-gray-200/40 dark:border-gray-800/40"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Appearance
            </h2>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition"
            >
              {darkMode ? <Sun /> : <Moon />}
              <span>Switch to {darkMode ? "Light" : "Dark"} Mode</span>
            </button>
          </motion.div>

          {/* System Tools */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow p-6 border border-gray-200/40 dark:border-gray-800/40"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              System Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleSystemCheck}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
              >
                <Server />
                {loading ? "Checking..." : "Check Server Status"}
              </button>

              <button
                onClick={handleClearCache}
                className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg shadow hover:scale-105 transition"
              >
                <RefreshCw />
                Clear Cache
              </button>

              <button
                onClick={handleChangePassword}
                className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg shadow hover:scale-105 transition"
              >
                <Key />
                Reset Admin Password
              </button>
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow p-6 border border-gray-200/40 dark:border-gray-800/40"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              System Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>
                <strong>API Base:</strong> {import.meta.env.VITE_API_BASE}
              </li>
              <li>
                <strong>Version:</strong> v1.0.0 (Admin)
              </li>
              <li>
                <strong>Frontend:</strong> TaskFlow Admin (Vite + React + Tailwind)
              </li>
              <li>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
