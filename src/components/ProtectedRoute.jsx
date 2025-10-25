import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    // si no es admin redirige a login
    return <Navigate to="/login" replace />;
  }
  return children;
}