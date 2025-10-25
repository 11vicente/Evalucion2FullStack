// src/components/OrderDetailsModal.jsx
import React from 'react';

export default function OrderDetailsModal({ order, onClose, onChangeStatus, onAddAttachment, onDeleteAttachment }) {
  if (!order) return null;

  function handleAddAttachment() {
    const url = prompt('Pega la URL del adjunto (imagen / factura)'); 
    if (url) {
      const name = url.split('/').pop();
      onAddAttachment && onAddAttachment({ url, name });
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Orden #{order.id} — {order.date ? new Date(order.date).toLocaleString() : ''}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <strong>Estado:</strong>{' '}
              <select value={order.status} onChange={(e) => onChangeStatus(e.target.value)} className="form-select form-select-sm d-inline-block w-auto ms-2">
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="mb-3">
              <strong>Items:</strong>
              <table className="table table-sm mt-2">
                <thead>
                  <tr><th>Producto</th><th className="text-center">Cant</th><th className="text-end">Precio</th><th className="text-end">Subtotal</th></tr>
                </thead>
                <tbody>
                  {(order.items || []).map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.name || it.productId}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-end">${Number(it.price || 0).toLocaleString()}</td>
                      <td className="text-end">${Number((it.price || 0) * (it.qty || 0)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <strong>Nota:</strong>
              <div className="small text-muted">{order.note || '-'}</div>
            </div>

            <div className="mb-3">
              <strong>Adjuntos</strong>
              <div className="d-flex flex-column gap-2 mt-2">
                {(order.attachments || []).length === 0 && <div className="text-muted small">No hay adjuntos.</div>}
                {(order.attachments || []).map((a, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center">
                    <a href={a.url} target="_blank" rel="noreferrer">{a.name || a.url}</a>
                    <div>
                      <button className="btn btn-sm btn-outline-danger me-2" onClick={() => onDeleteAttachment && onDeleteAttachment(a)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button className="btn btn-sm btn-outline-primary" onClick={handleAddAttachment}>Agregar adjunto (URL)</button>
              </div>
            </div>

            <div className="mt-2 text-end">
              <strong>Total:</strong> <span className="fw-bold ms-2">${Number(order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}