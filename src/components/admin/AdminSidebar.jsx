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
    <aside className="w-64 h-auto bg-gray-900 text-white flex flex-col p-6">
       <img
          src={
"/assets/logo/logopng.png" // default logo
          }
          alt="TaskFlow Logo"
          className="h-10 sm:h-8 object-contain transition-all duration-300"
        />
      <nav className="flex flex-col gap-3 mt-10">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
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
