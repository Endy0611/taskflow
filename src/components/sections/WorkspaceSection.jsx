// components/sections/WorkspaceSection.jsx
import { NavLink } from "react-router-dom";
import { BoardPreviewCard } from "../cards/BoardPreviewCard";

export function WorkspaceSection({ 
  workspaceName = "TaskFlow Workspaces",
  workspaceInitial = "S",
  boards = ["Boardup", "Create new board"],
  showNavigation = true,
  activeRoute = "/board"
}) {
  return (
    <section className="mb-16">
      <h2 className="text-lg sm:text-xl font-semibold mb-3">Your Workspaces</h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-md font-bold">
              {workspaceInitial}
            </div>
            <span className="font-semibold">{workspaceName}</span>
          </div>
          
          {showNavigation && (
            <div className="flex flex-wrap gap-2">
              <NavLink
                to="/workspaceboard"
                className={({ isActive }) =>
                  `px-3 py-1.5 border rounded text-sm ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-300 font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                Boards
              </NavLink>
              <NavLink
                to="/workspacemember"
                className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Member
              </NavLink>
              <NavLink
                to="/workspacesetting"
                className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Setting
              </NavLink>
              <button className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                Upgrade
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((title, idx) => (
            <BoardPreviewCard
              key={idx}
              title={title}
              imageId={idx + 20}
              isCreateNew={title === "Create new board"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}