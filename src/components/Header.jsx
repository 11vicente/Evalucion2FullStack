// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

function currentUser() {
  try {
    const u = JSON.parse(localStorage.getItem('ms_current_user'));
    return u || null;
  } catch {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate();
  const user = currentUser();

  function handleLogout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('ms_current_user');
    localStorage.removeItem('isAdmin');
    navigate('/');
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          
          {/* Logo */}
          <Link className="navbar-brand fs-3 d-flex align-items-center" to="/">
            <img
              src="/img/logo2.png"
              alt="Pastelería Mil Sabores"
              width="64"
              height="64"
              className="me-2"
            />
            PASTELERIA MIL SABORES
          </Link>

          {/* Hamburguesa móvil */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navegación */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Productos</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contacto</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cart">🛒 Carrito</Link></li>

              {isAdmin() && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Admin</Link>

                </li>
              )}
            </ul>

            {/* Zona derecha: cuenta */}
            <div className="d-flex ms-3 align-items-center">
              {user ? (
                <>
                  <span className="me-2 text-white small">Hola, {user.nombre}</span>

                  <Link to="/profile" className="btn btn-outline-light me-2">
                    Cuenta
                  </Link>

                  <button className="btn btn-danger" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-custom me-2">Iniciar Sesión</Link>
                  <Link to="/register" className="btn btn-outline-light">Registrar</Link>
                </>
              )}
            </div>
          </div>

        </div>
      </nav>
    </header>
  );
}
