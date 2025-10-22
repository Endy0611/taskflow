import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  FileText,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { http } from "../../services/http"; // your API helper

/** Helper function to display workspace name and avatar */
function NameAvatar({ name }) {
  const ch = (name || "W").trim().charAt(0).toUpperCase();
  return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold">
      {ch || "W"}
    </div>
  );
}
// ✅ Notify other components when boards are created or updated
export function notifyBoardsChanged() {
  try {
    localStorage.setItem("refresh_boards", String(Date.now()));
  } catch {}
  window.dispatchEvent(new CustomEvent("board:changed"));
}

// Exporting the function in the same file
export function notifyWorkspacesChanged() {
  try {
    localStorage.setItem("refresh_workspaces", String(Date.now()));
  } catch {}
  window.dispatchEvent(new CustomEvent("workspace:changed"));
}

function NavItem({ icon, text, to }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `group flex items-center gap-2 cursor-pointer rounded px-2 py-3
         text-gray-700 dark:text-gray-200
         ${isActive ? "bg-[#1E40AF] text-white" : ""}`
      }
    >
      {icon} {text}
    </NavLink>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, setShowModal }) {
  const navigate = useNavigate();

  const [openDropdowns, setOpenDropdowns] = useState({});
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState("");

  const [currentWsId, setCurrentWsId] = useState(
    () => localStorage.getItem("current_workspace_id") || ""
  );
  const [currentWsName, setCurrentWsName] = useState(
    () => localStorage.getItem("current_workspace_name") || ""
  );
  const [currentWsTheme, setCurrentWsTheme] = useState(
    () => localStorage.getItem("current_workspace_theme") || ""
  );

  // Function to load workspaces
  async function loadWorkspaces() {
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("Missing user_id — please log in again");

      const data = await http.get(`/user-workspaces/${userId}`);

      // Normalize data structure
      let list = Array.isArray(data)
        ? data
        : data?.content ||
          data?._embedded?.workspaces ||
          Object.values(data || {}).filter((x) => x?.id);

      // 🧩 Clean duplicates by ID
      const unique = new Map();
      list.forEach((w) => {
        const id = w.id ?? w.workspaceId;
        if (!unique.has(id)) {
          unique.set(id, {
            id,
            name: w.name ?? w.title ?? "Workspace",
            theme: w.theme ?? "ANGKOR",
          });
        }
      });

      // Final unique workspace list
      setWorkspaces(Array.from(unique.values()));
    } catch (err) {
      setError(err?.message || "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }

  // Load workspaces on component mount
  useEffect(() => {
    loadWorkspaces();
  }, []);
// ✅ Auto refresh workspaces when workspace is created or updated
useEffect(() => {
  const refresh = () => loadWorkspaces();

  // Listen to global event and localStorage sync
  window.addEventListener("workspace:changed", refresh);
  window.addEventListener("storage", (e) => {
    if (e.key === "refresh_workspaces") loadWorkspaces();
  });

  return () => {
    window.removeEventListener("workspace:changed", refresh);
    window.removeEventListener("storage", refresh);
  };
}, []);

  // Toggle dropdown for each workspace
  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Select workspace
  function selectWorkspace(w) {
    const id = String(w.id ?? w.workspaceId);
    localStorage.setItem("current_workspace_id", id);
    localStorage.setItem("current_workspace_name", w.name || "");
    localStorage.setItem("current_workspace_theme", w.theme || "");
    setCurrentWsId(id);
    setCurrentWsName(w.name || "");
    setCurrentWsTheme(w.theme || "");
    navigate(`/board/${id}`);
    setSidebarOpen?.(false);
  }

  // Function to handle navigation to the correct page (Board, Member, or Setting)
  function navigateToWorkspacePage(workspaceId, type) {
  if (type === "boards") {
    navigate(`/board/${workspaceId}`);
  } else if (type === "members") {
    navigate(`/workspacemember/${workspaceId}`);
  } else if (type === "settings") {
    navigate(`/workspacesetting/${workspaceId}`);
  }


}


  return (
    <aside
      className={[
        "transform transition-transform duration-300 will-change-transform",
        "fixed inset-y-0 left-0 w-64 z-40 bg-gray-50 dark:bg-gray-900",
        "border-r border-gray-300 dark:border-gray-700",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:translate-x-0 lg:inset-auto lg:h-screen lg:z-0",
        "top-0",
      ].join(" ")}
    >
      <div className="p-4 text-sm">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between lg:hidden mb-2">
          <span className="font-semibold">Menu</span>
          <button
            aria-label="Close sidebar"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Navigation items */}
        <div className="space-y-1">
          <NavItem icon={<Home size={16} />} text="Home" to="/homeuser" />
          <NavItem
            icon={<LayoutGrid size={16} />}
            text="Boards"
            to={currentWsId ? `/board/${currentWsId}` : "/board"}
          />
          <NavItem
            icon={<FileText size={16} />}
            text="Templates"
            to="/templateuser"
          />
        </div>

        <div className="border-b my-4 border-gray-300 dark:border-gray-700" />

        {/* Workspace Dropdowns */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Workspace
          </h3>

          {/* Loop through workspaces */}
          {workspaces.map((w) => {
            const id = String(w.id ?? w.workspaceId);
            const isOpen = openDropdowns[id];

            return (
              <div key={`${id}-${w.name}-${Math.random()}`}>
                {/* Workspace name and toggle button */}
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded ${
                    isOpen
                      ? "bg-[#1E40AF] text-white"
                      : "text-gray-800 dark:text-gray-200"
                  } hover:bg-[#2563EB] hover:text-white`}
                  onClick={() => toggleDropdown(id)}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <NameAvatar name={w.name} />
                    <span className="truncate">{w.name || "Untitled"}</span>
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                <AnimatePresence initial={false}>
                  {/* Dropdown menu for workspace */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden rounded-b-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigateToWorkspacePage(id, "boards")}
                      >
                        Boards
                      </div>
                      <div
                        className="px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigateToWorkspacePage(id, "members")}
                      >
                        Members
                      </div>
                      <div
                        className="px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigateToWorkspacePage(id, "settings")}
                      >
                        Settings
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Create Workspace Button */}
        <button
          className="mt-3 text-[#1E40AF] dark:text-white text-sm hover:bg-[#2563EB] hover:text-white rounded py-2 px-3 w-full justify-start flex items-center gap-2 border border-blue-600 dark:border-blue-400"
          onClick={() => setShowModal?.(true)}
        >
          + Create a Workspace
        </button>
      </div>
    </aside>
  );
}
