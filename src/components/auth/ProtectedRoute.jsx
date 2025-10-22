// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // 1️⃣ No token → go back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Role restriction check
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If not admin or not allowed, send to board
    return <Navigate to="/board" replace />;
  }

  // 3️⃣ If everything ok, render the route
  return <Outlet />;
}
