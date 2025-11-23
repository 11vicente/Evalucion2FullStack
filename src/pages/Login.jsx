import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../data/usersCRUD';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');
    try {
      await login({ email: form.email, password: form.password });
      setMensaje('Inicio de sesión correcto. Redirigiendo...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      setMensaje(err.message || 'Error al iniciar sesión');
    }
  }

  return (
    <div className="container my-4" style={{ maxWidth: 560 }}>
      <h1 className="titulo text-center mt-4">Iniciar Sesión</h1>

      <section className="login-container my-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            <Link to="/register" className="btn btn-outline-secondary">Registrar</Link>
          </div>
        </form>

        {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
      </section>
    </div>
  );
}