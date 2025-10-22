import React, { useState, useEffect } from "react";
import DynamicNavbar from "./DynamicNavbar";
import { Outlet } from "react-router-dom";
import FooterB4Login from "../nav&footer/FooterB4Login";

function UserLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isDark = localStorage.theme === "dark";
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <>
      <DynamicNavbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowModal={setShowModal}
      />
      <Outlet />
      <FooterB4Login />
    </>
  );
}

export default UserLayout;
