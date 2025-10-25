// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate, readById } from '../data/usersCRUD';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const user = authenticate(email, pass);
    if (!user) {
      alert('Credenciales inválidas.');
      return;
    }
    // guarda sesión mínima
    localStorage.setItem('ms_current_user', JSON.stringify({ id: user.id, nombre: user.nombre, email: user.email }));
    localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
    if (user.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }

  function handleLogout() {
    localStorage.removeItem('ms_current_user');
    localStorage.setItem('isAdmin', 'false');
    window.location.href = '/';
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-3">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit">Entrar</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </form>
      </div>
    </div>
  );
}