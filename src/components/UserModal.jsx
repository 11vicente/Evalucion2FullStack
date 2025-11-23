// src/components/UserModal.jsx
import React, { useEffect, useState } from "react";

export default function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    isAdmin: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || "",
        email: user.email || "",
        password: "",
        isAdmin: !!(user.isAdmin || user.IsAdmin) // handle both cases
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    setError(null);
    if (!form.nombre || form.nombre.trim().length < 2) {
      setError("Nombre mínimo 2 caracteres");
      return false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Email inválido");
      return false;
    }
    if (!user) {
      // creating: require password
      if (!form.password || form.password.length < 6) {
        setError("Contraseña mínima 6 caracteres");
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      // onSave will close modal by parent
    } catch (err) {
      setError(err?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{user ? `Editar usuario #${user.id}` : "Crear usuario"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>

              {!user && (
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} />
                </div>
              )}

              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isAdmin" name="isAdmin" checked={form.isAdmin} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isAdmin">Administrador</label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
