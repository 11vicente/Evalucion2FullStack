import React, { useState } from 'react';

export default function CheckoutModal({ show, onClose, onConfirm }) {
  const [form, setForm] = useState({
    nombre: '',
    calle: '',
    numero: '',
    comuna: '',
    region: '',
    telefono: '',
    instrucciones: ''
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.nombre.trim() || !form.calle.trim() || !form.comuna.trim()) {
      setError('Complete nombre, calle y comuna.');
      return;
    }
    if (!form.telefono.trim()) {
      setError('Ingrese teléfono de contacto.');
      return;
    }
    onConfirm && onConfirm(form);
  }

  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Finalizar compra - Dirección</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-2">
                <label className="form-label">Nombre contacto</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
              </div>

              <div className="row g-2">
                <div className="col-8">
                  <label className="form-label">Calle</label>
                  <input name="calle" className="form-control" value={form.calle} onChange={handleChange} required />
                </div>
                <div className="col-4">
                  <label className="form-label">Número</label>
                  <input name="numero" className="form-control" value={form.numero} onChange={handleChange} />
                </div>
              </div>

              <div className="row g-2 mt-2">
                <div className="col-6">
                  <label className="form-label">Región</label>
                  <input name="region" className="form-control" value={form.region} onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label className="form-label">Comuna</label>
                  <input name="comuna" className="form-control" value={form.comuna} onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-2 mt-2">
                <label className="form-label">Teléfono</label>
                <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} required />
              </div>

              <div className="mb-2">
                <label className="form-label">Instrucciones (opcional)</label>
                <textarea name="instrucciones" className="form-control" value={form.instrucciones} onChange={handleChange} />
              </div>

              <div className="small text-muted">Al confirmar la compra simularemos el pago y generaremos la boleta. Resultado: éxito o error (aleatorio).</div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Confirmar compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}