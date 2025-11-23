// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("jwtToken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Si no hay token → no está logueado
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin y no es admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
