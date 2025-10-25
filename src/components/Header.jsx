// src/components/Header.jsx  (actualizado para mostrar usuario)
import React from 'react';
import { Link } from 'react-router-dom';

function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('ms_current_user'));
  } catch {
    return null;
  }
}

export default function Header() {
  const user = currentUser();
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand fs-3 d-flex align-items-center" to="/">
            <img src="/img/logo2.png" alt="Pastelería Mil Sabores" width="64" height="64" className="me-2" />
            PASTELERIA MIL SABORES
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Productos</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contacto</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cart">🛒 Carrito</Link></li>

              {isAdmin() && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
            </ul>

            <div className="d-flex ms-3 align-items-center">
              {user ? (
                <>
                  <span className="me-2 text-white small">Hola, {user.nombre}</span>
                  <Link to="/login" className="btn btn-outline-light">Cuenta</Link>
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