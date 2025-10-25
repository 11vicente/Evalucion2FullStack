// src/pages/Register.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from '../data/usersCRUD';

const REGION_COMUNAS = {
  RMS: ['Santiago', 'Providencia', 'Las Condes'],
  Araucania: ['Temuco', 'Villarrica'],
  Nuble: ['Chillán', 'San Carlos']
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    confirmarCorreo: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    edad: '',
    codigo: '',
    region: '',
    comuna: ''
  });
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (form.region) {
      setComunas(REGION_COMUNAS[form.region] || []);
      setForm(f => ({ ...f, comuna: '' }));
    } else {
      setComunas([]);
      setForm(f => ({ ...f, comuna: '' }));
    }
  }, [form.region]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.nombre.trim()) throw new Error('Ingrese nombre.');
    if (!form.correo || !form.confirmarCorreo) throw new Error('Complete el correo y su confirmación.');
    if (form.correo !== form.confirmarCorreo) throw new Error('Los correos no coinciden.');
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) throw new Error('Correo inválido.');
    if (!form.password || !form.confirmarPassword) throw new Error('Complete la contraseña y su confirmación.');
    if (form.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
    if (form.password !== form.confirmarPassword) throw new Error('Las contraseñas no coinciden.');
    if (!form.edad || Number(form.edad) < 1) throw new Error('Edad inválida.');
    if (!form.region) throw new Error('Seleccione región.');
    if (!form.comuna) throw new Error('Seleccione comuna.');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');
    try {
      validate();
      const newUser = {
        nombre: form.nombre,
        email: form.correo,
        password: form.password,
        telefono: form.telefono,
        edad: Number(form.edad),
        region: form.region,
        comuna: form.comuna,
        isAdmin: false,
        orders: []
      };
      create(newUser);
      // iniciar sesión automático guardando el usuario en localStorage
      const created = window.open ? null : null; // noop (compat)
      localStorage.setItem('ms_current_user', JSON.stringify({ nombre: newUser.nombre, email: newUser.email }));
      // no ponemos isAdmin en localStorage aquí; Login se encargará de eso (pero podemos setear false)
      localStorage.setItem('isAdmin', 'false');
      setMensaje('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setMensaje(err.message || 'Error');
    }
  }

  return (
    <div>
      <h1 className="titulo text-center mt-4">Registro de Usuario</h1>
      <section className="registro-container container my-4">
        <form id="registroForm" onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />

          <label>Correo</label>
          <input type="email" id="correo" name="correo" value={form.correo} onChange={handleChange} required />

          <label>Confirmar correo</label>
          <input type="email" id="confirmarCorreo" name="confirmarCorreo" value={form.confirmarCorreo} onChange={handleChange} required />

          <label>Contraseña</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} minLength="6" required />

          <label>Confirmar contraseña</label>
          <input type="password" id="confirmarPassword" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} required />

          <label>Teléfono (opcional)</label>
          <input type="tel" id="telefono" name="telefono" value={form.telefono} onChange={handleChange} maxLength="15" />

          <label>Edad</label>
          <input type="number" id="edad" name="edad" value={form.edad} onChange={handleChange} min="1" required />

          <label>Código de Descuento</label>
          <input type="text" id="codigo" name="codigo" value={form.codigo} onChange={handleChange} />

          <label>Región</label>
          <select id="region" name="region" value={form.region} onChange={handleChange} required>
            <option value="">-- Seleccione la región --</option>
            <option value="RMS">Región Metropolitana de Santiago</option>
            <option value="Araucania">Región de la Araucanía</option>
            <option value="Nuble">Región de Ñuble</option>
          </select>

          <label>Comuna</label>
          <select id="comuna" name="comuna" value={form.comuna} onChange={handleChange} required>
            <option value="">-- Seleccione la comuna --</option>
            {comunas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button type="submit" className="btn btn-primary mt-3">Registrar</button>
        </form>

        {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
      </section>
    </div>
  );
}