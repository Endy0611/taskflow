import React from "react";
import { NavLink } from "react-router-dom";
import { Users, FolderKanban, LayoutDashboard, BarChart, Settings } from "lucide-react";

export default function AdminSidebar() {
  const menu = [
    { title: "Dashboard", icon: <LayoutDashboard />, to: "/admin" },
    { title: "Users", icon: <Users />, to: "/admin/users" },
    { title: "Workspaces", icon: <FolderKanban />, to: "/admin/workspaces" },
    { title: "Boards", icon: <LayoutDashboard />, to: "/admin/boards" },
    { title: "Analytics", icon: <BarChart />, to: "/admin/analytics" },
    { title: "Settings", icon: <Settings />, to: "/admin/settings" },
  ];

  return (
    <aside className="w-64 h-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col p-6 border-r border-gray-200 dark:border-gray-800">
       <img
          src="/assets/logo/logofinal1.png"
          alt="TaskFlow Logo"
          className="h-10 sm:h-8 object-contain transition-all duration-300 dark:hidden"
        />
       <img
          src="/assets/logo/logopng.png"
          alt="TaskFlow Logo"
          className="h-10 sm:h-8 object-contain transition-all duration-300 hidden dark:block"
        />
      <nav className="flex flex-col gap-3 mt-10">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}