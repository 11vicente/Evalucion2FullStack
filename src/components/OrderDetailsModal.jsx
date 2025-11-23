// src/components/OrderDetailsModal.jsx
import React from 'react';

export default function OrderDetailsModal({
  order,
  onClose,
  onChangeStatus,
  onAddAttachment,
  onDeleteAttachment
}) {
  if (!order) return null;

  function handleAddAttachment() {
    const url = prompt('Pega la URL del adjunto (imagen / factura)');
    if (!url) return;

    const name = url.split('/').pop() || 'archivo';

    if (onAddAttachment) onAddAttachment({ url, name });
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">
              Orden #{order.id} —{' '}
              {order.date ? new Date(order.date).toLocaleString() : 'Sin fecha'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* Estado */}
            <div className="mb-3">
              <strong>Estado:</strong>
              <select
                value={order.status || 'pendiente'}
                onChange={(e) => onChangeStatus && onChangeStatus(e.target.value)}
                className="form-select form-select-sm d-inline-block w-auto ms-2"
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Items */}
            <div className="mb-3">
              <strong>Items:</strong>

              <table className="table table-sm mt-2">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {(order.items || []).map((item, index) => {
                    const qty = Number(item.qty || 0);
                    const price = Number(item.price || 0);
                    const subtotal = qty * price;

                    return (
                      <tr key={index}>
                        <td>{item.name || `Producto ${item.productId || ''}`}</td>
                        <td className="text-center">{qty}</td>
                        <td className="text-end">${price.toLocaleString()}</td>
                        <td className="text-end">${subtotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Nota */}
            <div className="mb-3">
              <strong>Nota:</strong>
              <div className="small text-muted">
                {order.note && order.note.trim() !== '' ? order.note : 'No hay notas.'}
              </div>
            </div>

            {/* Adjuntos */}
            <div className="mb-3">
              <strong>Adjuntos</strong>

              <div className="d-flex flex-column gap-2 mt-2">
                {(order.attachments || []).length === 0 && (
                  <div className="text-muted small">No hay adjuntos.</div>
                )}

                {(order.attachments || []).map((att, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <a href={att.url} target="_blank" rel="noreferrer">
                      {att.name || att.url}
                    </a>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        onDeleteAttachment && onDeleteAttachment(att)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-sm btn-outline-primary mt-3"
                onClick={handleAddAttachment}
              >
                Agregar adjunto (URL)
              </button>
            </div>

            {/* Total */}
            <div className="mt-3 text-end">
              <strong>Total:</strong>{' '}
              <span className="fw-bold ms-2">
                ${Number(order.total || 0).toLocaleString()}
              </span>
            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
