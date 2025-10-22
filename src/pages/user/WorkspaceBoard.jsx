import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../../components/sidebar/Sidebar";  // Use Sidebar.jsx
import TaskFlowChatbot from "../../components/chatbot/Chatbot";
import { CreateBoardComponent } from "../../components/task/CreateBoardComponent";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

export default function WorkspaceBoard() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const preferDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (preferDark) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isTablet = window.innerWidth < 1024;
      setIsTabletOrBelow(isTablet);
      if (!isTablet) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && isTabletOrBelow && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Use Sidebar.jsx only */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setShowModal={setShowModal} // ✅ Keep this
        />

        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100 dark:bg-gray-900 transition-all duration-300 ${
            sidebarOpen && isTabletOrBelow ? "opacity-40 pointer-events-none" : ""
          }`}
          onClick={() => {
            if (isTabletOrBelow && sidebarOpen) setSidebarOpen(false);
          }}
        >
          {/* ===== Header ===== */}
          <div className="mb-8 sm:mb-10">
            <button
              className="lg:hidden p-2 rounded-md bg-primary text-white shadow-md"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white text-lg sm:text-2xl font-bold shadow-md sm:shadow-lg">
                TF
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  TaskFlow Workspace
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  🔒 Private workspace
                </p>
              </div>
            </div>
          </div>

          {/* ===== Your Boards Section ===== */}
          <section className="mb-10 sm:mb-12">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Your Boards
            </h2>
            <div className="grid gap-4 sm:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              <NavLink
                to="/projectmanagement"
                onClick={() =>
                  localStorage.setItem(
                    "boardBackground",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                  )
                }
                className="block"
              >
                <BoardCard
                  title="Project Management"
                  image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                  color="from-blue-600 to-indigo-500"
                />
              </NavLink>

              <BoardCard
                title="Create new board"
                color="from-purple-500 to-pink-500"
                subtitle="9 remaining"
                isCreate
                onClick={() => setShowCreateBoard(true)}
              />
            </div>
          </section>

          <div className="border-t border-gray-300 dark:border-gray-700 my-8 sm:my-10" />

          {/* ===== All Boards ===== */}
          <section>
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              All Boards in this Workspace
            </h2>
            <div className="grid gap-4 sm:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {/* Example Boards (replace with dynamic rendering) */}
              <NavLink
                to="/projectmanagement"
                onClick={() =>
                  localStorage.setItem(
                    "boardBackground",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                  )
                }
                className="block"
              >
                <BoardCard
                  title="Project Management"
                  image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                />
              </NavLink>

              {/* Java - Expense Tracker */}
              <NavLink
                to="/projectmanagement"
                onClick={() =>
                  localStorage.setItem(
                    "boardBackground",
                    "https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop"
                  )
                }
                className="block"
              >
                <BoardCard
                  title="Java - Expense Tracker"
                  image="https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop"
                />
              </NavLink>

              {/* Document */}
              <NavLink
                to="/projectmanagement"
                onClick={() =>
                  localStorage.setItem(
                    "boardBackground",
                    "https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop"
                  )
                }
                className="block"
              >
                <BoardCard
                  title="Document"
                  image="https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop"
                />
              </NavLink>

              <BoardCard
                title="Create new board"
                color="from-blue-500 to-teal-400"
                subtitle="7 remaining"
                isCreate
                onClick={() => setShowCreateBoard(true)}
              />
            </div>
          </section>

          {/* ===== Chatbot Icon ===== */}
          <img
            src="/assets/general/chatbot.png"
            alt="Chatbot"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg cursor-pointer bg-white z-40 hover:scale-105 transition-transform duration-200"
            onClick={() => setShowChatbot(true)}
          />
        </main>
      </div>

      {/* ===== Create Board Modal ===== */}
      <AnimatePresence>
        {showCreateBoard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <CreateBoardComponent onClose={() => setShowCreateBoard(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            className="fixed bottom-20 right-3 sm:bottom-24 sm:right-8 z-50 w-[90%] max-w-[380px] sm:max-w-[420px] md:max-w-[480px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-[85vh] flex flex-col">
              <TaskFlowChatbot onClose={() => setShowChatbot(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== BoardCard Component ===== */
function BoardCard({ title, subtitle, color, image, isCreate, onClick }) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative rounded-2xl shadow-lg overflow-hidden cursor-pointer bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 h-52 sm:h-56 md:h-64 lg:h-72 flex flex-col"
      onClick={onClick}
    >
      <div className="w-full h-36 sm:h-40 md:h-44 lg:h-52">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${color} text-white font-semibold`}
          >
            {isCreate ? (
              <span className="text-3xl sm:text-4xl">+</span>
            ) : (
              <span className="text-base sm:text-lg md:text-xl text-center px-2">
                {title}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="h-16 sm:h-16 md:h-20 lg:h-20 px-4 flex flex-col justify-center bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );

  return isCreate ? content : content;
}
