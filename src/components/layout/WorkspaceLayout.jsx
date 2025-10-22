import React, { useState, useEffect } from "react";
import NavbarComponent from "../nav&footer/NavbarComponent";
import DynamicNavbar from "./DynamicNavbar";
import { Outlet, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Home,
  LayoutGrid,
  FileText,
  ChevronUp,
  ChevronDown,
  Menu,
} from "lucide-react";

function WorkspaceLayout() {
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

      {/* Sidebar is here now */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-64 z-40 bg-gray-50 dark:bg-gray-900 
                       border-r border-gray-300 dark:border-gray-700 shadow-lg md:hidden"
          >
            <div className="p-4 text-sm h-full flex flex-col">
              {/* Close button */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Menu</span>
                <button
                  aria-label="Close sidebar"
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X />
                </button>
              </div>

              {/* Static links */}
              <div className="space-y-1 text-black dark:text-white">
                <NavLink
                  to="/homeuser"
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home size={16} /> Home
                </NavLink>
                <NavLink
                  to="/board"
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LayoutGrid size={16} /> Boards
                </NavLink>
                <NavLink
                  to="/templateuser"
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText size={16} /> Templates
                </NavLink>
              </div>

              <div className="border-b my-4 border-gray-400 dark:border-gray-700" />

              {/* Workspace dropdown */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Workspace
                </h3>
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded 
                    ${
                      openDropdown
                        ? "bg-blue-700 text-white"
                        : "text-gray-800 dark:text-gray-200"
                    } 
                    hover:bg-blue-600 hover:text-white`}
                  onClick={() => setOpenDropdown((v) => !v)}
                >
                  <span className="flex items-center gap-2 font-medium">
                    🌍 TaskFlow
                  </span>
                  {openDropdown ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                <AnimatePresence>
                  {openDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden text-gray-600 dark:text-gray-300 rounded-b-lg 
                                 border border-gray-100 dark:border-gray-700"
                    >
                      <NavLink
                        to="/workspaceboard"
                        className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Boards
                      </NavLink>
                      <NavLink
                        to="/workspacemember"
                        className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Members
                      </NavLink>
                      <NavLink
                        to="/workspacesetting"
                        className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Settings
                      </NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className="mt-3 text-blue-700 dark:text-white text-sm hover:bg-blue-600 
                             hover:text-white rounded py-2 px-3 w-full flex items-center gap-2 
                             border border-blue-600 dark:border-blue-400"
                  onClick={() => setShowModal(true)}
                >
                  + Create a Workspace
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Outlet />
    </>
  );
}

export default WorkspaceLayout;
