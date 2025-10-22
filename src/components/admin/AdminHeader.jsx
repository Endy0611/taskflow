import React from "react";

export default function AdminHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 border-b">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Welcome, {user?.username || "Admin"}
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
