import { useState, useEffect, useCallback } from "react";
import { Search, Bell, SunIcon, MoonIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { http } from "../../services/http";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://taskflow-api.istad.co";

export default function NavbarComponent({
  user,
  darkMode,
  toggleDarkMode,
  setSidebarOpen,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [invitesCount, setInvitesCount] = useState(0);
  const navigate = useNavigate();

  /* ---------------- Username Sync ---------------- */
  useEffect(() => {
    const updateUsername = () =>
      setUsername(localStorage.getItem("username") || "");
    updateUsername();
    window.addEventListener("storage", updateUsername);
    return () => window.removeEventListener("storage", updateUsername);
  }, []);

  /* ---------------- Fetch Pending Invites ---------------- */
  const fetchInvitesCount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return setInvitesCount(0);

      // ✅ Correct API endpoint — fetch all workspaceMembers by userId
      const res = await http.get(
        `${API_BASE}/workspaceMembers?userId=${userId}`
      );

      // Normalize API response
      const list = Array.isArray(res)
        ? res
        : res?.content || res?._embedded?.workspaceMembers || [];

      // ✅ Count only pending invitations (isAccepted === false)
      const pending = list.filter((m) => m.isAccepted === false);
      setInvitesCount(pending.length);
    } catch (err) {
      console.error("❌ Failed to fetch invites count:", err);
      setInvitesCount(0);
    }
  }, []);

  /* ---------------- Auto Refresh ---------------- */
  useEffect(() => {
    fetchInvitesCount();

    const refresh = () => fetchInvitesCount();
    window.addEventListener("invitation:new", refresh);
    window.addEventListener("invitation:updated", refresh);
    window.addEventListener("workspace:changed", refresh);
    window.addEventListener("userLoggedIn", refresh);
    window.addEventListener("userLoggedOut", refresh);

    const interval = setInterval(fetchInvitesCount, 60000); // every minute
    return () => {
      [
        "invitation:new",
        "invitation:updated",
        "workspace:changed",
        "userLoggedIn",
        "userLoggedOut",
      ].forEach((e) => window.removeEventListener(e, refresh));
      clearInterval(interval);
    };
  }, [fetchInvitesCount]);

  /* ---------------- Maintain Body Padding ---------------- */
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) document.body.style.paddingTop = `${navbar.offsetHeight}px`;
    const resize = () => {
      const h = document.getElementById("navbar")?.offsetHeight || 0;
      document.body.style.paddingTop = `${h}px`;
    };
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.paddingTop = "0px";
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ---------------- Close Dropdown on Outside Click ---------------- */
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("#profile-menu")) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ---------------- User Initials ---------------- */
  const initials =
    username?.slice(0, 2).toUpperCase() ||
    user?.name?.slice(0, 2).toUpperCase() ||
    "U";

  /* ---------------- Render ---------------- */
  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full font-roboto z-50 transition-all duration-300 backdrop-blur-md border-b 
        ${
          darkMode
            ? "bg-[#0f172a]/90 border-gray-700 text-gray-100" // 🌙 deep blue-gray tone like NavbarB4Login
            : "bg-primary text-white border-blue-700 shadow-md"
        } 
        px-3 sm:px-5 md:px-7 lg:px-10 py-2 md:py-3 flex items-center justify-between`}
    >
      {/* Left Section */}
      <div
        className="flex items-center gap-2 sm:gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={
            darkMode
              ? "/assets/logo/logopng.png" // bright logo for dark mode
              : "/assets/logo/logopng.png" // default logo
          }
          alt="TaskFlow Logo"
          className="h-7 sm:h-7 object-contain transition-all duration-300"
        />
      </div>

      {/* Search + Create */}
      <div className="hidden md:flex items-center flex-1 max-w-md lg:max-w-lg mx-4">
        <div className="flex-1 px-3">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-9 pr-3 py-1.5 rounded text-sm transition-all
                ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                    : "bg-white text-black placeholder-gray-500"
                }`}
            />
          </div>
        </div>
        <button
          onClick={() => navigate("/create")}
          className={`px-3 py-1 rounded text-sm font-medium transition 
            ${
              darkMode
                ? "bg-blue-700 hover:bg-blue-800 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
        >
          Create
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative">
        {/* 🔔 Notifications */}
        <button
          className="relative hidden sm:block"
          onClick={() => navigate("/invitations")}
          title="Pending invitations"
        >
          <Bell
            className={`w-5 h-5 md:w-6 md:h-6 transition ${
              darkMode
                ? "text-gray-200 hover:text-gray-100"
                : "text-white hover:text-gray-200"
            }`}
          />
          {invitesCount > 0 && (
            <motion.span
              key={invitesCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm"
            >
              {invitesCount > 99 ? "99+" : invitesCount}
            </motion.span>
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative" id="profile-menu">
          <button
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold overflow-hidden transition 
              ${darkMode ? "bg-blue-600" : "bg-orange-400"}`}
            onClick={() => setOpen((v) => !v)}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-3 w-56 sm:w-64 md:w-72 rounded-xl shadow-lg border overflow-hidden z-50
                  ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-black border-gray-200"
                  }`}
              >
                {/* User Info */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white overflow-hidden">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {username || "User"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[130px] sm:max-w-[160px]">
                      {user?.email || `${username}@taskflow.local`}
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <ul className="py-2 text-sm">
                  <li
                    onClick={() => {
                      setOpen(false);
                      navigate("/switch-account");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Switch accounts
                  </li>
                  <li
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Profile & Visibility
                  </li>
                  <li
                    onClick={() => {
                      setOpen(false);
                      navigate("/settingworkspace");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Settings
                  </li>

                  {/* Dark Mode Toggle */}
                  <li
                    onClick={toggleDarkMode}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {darkMode ? " Light Mode" : " Dark Mode"}
                    </span>
                    <span className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center">
                      <span
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                          darkMode ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </li>
                </ul>

                {/* Logout */}
                <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                  <div
                    onClick={() => {
                      setOpen(false);
                      onLogout?.();
                    }}
                    className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer text-sm text-red-600"
                  >
                    Log out
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="cursor-pointer">
          {darkMode ? (
            <SunIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 hover:text-yellow-200" />
          ) : (
            <MoonIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 hover:text-yellow-200" />
          )}
        </button>
      </div>
    </nav>
  );
}
