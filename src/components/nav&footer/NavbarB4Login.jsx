import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavbarB4Login({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Templates", path: "/templates" },
    { name: "About Us", path: "/about" },
  ];

  // Effect to apply dark mode when darkMode prop changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav
      className={`font-roboto fixed top-0 w-full z-50 ${
        darkMode ? "bg-gray-900/70 dark:bg-gray-900/70" : "bg-white/70"
      } backdrop-blur-md border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[65px]">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          {/* <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div> */}
          <NavLink
            to="/"
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            } tracking-tight`}
          >
              <img
          src={
            darkMode
              ? "/assets/logo/logopng.png" // bright logo for dark mode
              : "/assets/logo/logofinal1.png" // default logo
          }
          alt="TaskFlow Logo"
          className="h-10 sm:h-12 object-contain transition-all duration-300"
        />
          </NavLink>
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Buttons + Theme */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className={`hidden lg:block ${
              darkMode ? "text-gray-200" : "text-gray-700"
            } font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
          >
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="hidden lg:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
          >
            Sign up - It's free!
          </NavLink>

          {/* Dark Mode Toggle */}
          {darkMode ? (
            <Sun
              size={22}
              className="cursor-pointer text-yellow-400 hover:scale-110 transition"
              onClick={toggleDarkMode}
            />
          ) : (
            <Moon
              size={22}
              className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-200 hover:scale-110 transition"
              onClick={toggleDarkMode}
            />
          )}

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${darkMode ? "text-gray-200" : "text-gray-800"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`${
            darkMode ? "bg-gray-900 dark:bg-gray-900" : "bg-white"
          } border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-3`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2"
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className={`block ${
              darkMode ? "text-gray-200" : "text-gray-700"
            } px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm"
          >
            Sign up - It's free!
          </NavLink>
        </div>
      </div>
    </nav>
  );
}