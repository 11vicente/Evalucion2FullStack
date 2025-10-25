import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; 
function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('ms_current_user') || 'null');
  } catch {
    return null;
  }
}

export default function AdminLayout() {
  const user = currentUser();
  const navigate = useNavigate();

  function handleLogout() {
    // cerrar sesión administrativa (pero no eliminar todos los datos)
    localStorage.removeItem('ms_current_user');
    localStorage.setItem('isAdmin', 'false');
    // redirigir al home y forzar recarga para actualizar Header
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="admin-layout d-flex">
      <aside style={{ width: 250 }} className="bg-white border-end vh-100 p-3 position-sticky top-0">
        <div className="d-flex align-items-center mb-3">
          <img src="/img/logo2.png" alt="Logo" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} className="me-2" />
          <div>
            <div className="fw-bold">Panel Admin</div>
            <small className="text-muted">Pastelería Mil Sabores</small>
          </div>
        </div>

        <div className="mb-3">
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="fw-semibold">{user.nombre}</div>
                <div className="small text-muted">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-muted small">No hay usuario</div>
          )}
        </div>

        <nav className="nav-admin1 nav flex-column">
          <Link className="nav-link" to="/admin"style={{ color: '#ff0b0bff' }}>📊 Dashboard</Link>
          <Link className="nav-link" to="/admin/products"style={{ color: '#000' }}>📦 Productos</Link>
          <Link className="nav-link" to="/admin/users">👥 Usuarios</Link>
          <Link className="nav-link" to="/admin/orders"style={{ color: '#000' }}>🧾 Órdenes</Link>
          <hr />
          <Link className="nav-link text-muted" to="/">🔙 Ver sitio</Link>
        </nav>

        <div className="mt-4">
          <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="flex-grow-1 p-3">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>
    </div>
  );
}