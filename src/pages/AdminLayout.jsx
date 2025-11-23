// src/pages/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, currentUser } from "../data/usersCRUD";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = currentUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <nav
        className="d-flex flex-column p-3 bg-dark text-white"
        style={{ width: "260px" }}
      >
        <h3 className="mb-4">Panel Admin</h3>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/dashboard">
              Dashboard
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/products">
              Productos
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/orders">
              Órdenes
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/users">
              Usuarios
            </Link>
          </li>
        </ul>

        <hr />

        <div className="mt-auto">
          <div className="small text-muted mb-2">
            Conectado como <strong>{user?.nombre}</strong>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO DEL PANEL */}
      <div className="flex-grow-1 p-4" style={{ background: "#f7f7f7" }}>
        <Outlet />
      </div>
    </div>
  );
}
