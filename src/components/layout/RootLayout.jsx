import React, { useEffect, useState } from "react";
import NavbarB4Login from "../nav&footer/NavbarB4Login";
import ScrollToTop from "./ScrollToTop";
import DynamicNavbar from "./DynamicNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import FooterB4Login from "../nav&footer/FooterB4Login";
import OfflineMode from "../../utils/OfflineMode";

export default function RootLayout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false
  );
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Track online/offline
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ✅ Initialize dark theme
  useEffect(() => {
    const preferDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(Boolean(preferDark));
    document.documentElement.classList.toggle("dark", Boolean(preferDark));
  }, []);

  // ✅ Listen for login/logout/localStorage changes
  useEffect(() => {
  const handleUserChange = () => {
    setIsLoggedIn(!!localStorage.getItem("user") || !!localStorage.getItem("username"));
  };

  window.addEventListener("storage", handleUserChange);
  window.addEventListener("userLoggedIn", handleUserChange);
  window.addEventListener("userLoggedOut", handleUserChange);

  handleUserChange(); // run immediately

  return () => {
    window.removeEventListener("storage", handleUserChange);
    window.removeEventListener("userLoggedIn", handleUserChange);
    window.removeEventListener("userLoggedOut", handleUserChange);
  };
}, []);


  // ✅ Toggle dark/light mode
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.theme = next ? "dark" : "light";
  };

  // ✅ Global logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");

    // ✅ Trigger re-render
    window.dispatchEvent(new Event("userLoggedOut"));

    // ✅ Optional redirect to homepage or login
    navigate("/");
  };

  if (!isOnline) return <OfflineMode />;

  return (
    <div>
      {isLoggedIn ? (
        <DynamicNavbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setShowModal={setShowModal}
          onLogout={handleLogout}
        />
      ) : (
        <NavbarB4Login
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <ScrollToTop />
      <Outlet />

      {/* ✅ Only show footer when not logged in */}
      {!isLoggedIn && <FooterB4Login />}
    </div>
  );
}
