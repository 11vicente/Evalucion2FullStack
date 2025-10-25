import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessModal({ show, order, userId, onClose }) {
  const navigate = useNavigate();
  if (!show || !order) return null;

  function handleViewTracking() {
    navigate(`/tracking/${userId}/${order.id}`);
  }

  function handlePrint() {
    const html = `
      <html>
        <head>
          <title>Boleta #${order.id}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color:#111 }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
            .items table { width:100%; border-collapse: collapse; }
            .items th, .items td { border:1px solid #ddd; padding:8px; text-align:left; }
            .total { text-align:right; margin-top:12px; font-size:1.1rem; font-weight:700; }
            .meta { font-size:0.9rem; color:#444; margin-top:10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>Boleta #${order.id}</h2>
              <div>Fecha: ${new Date(order.date || Date.now()).toLocaleString()}</div>
              <div>Cliente: ${order.userName || ''} &lt;${order.userEmail || ''}&gt;</div>
              <div>Estado: ${order.status || 'pendiente'}</div>
            </div>
            <div>
              <img src="/img/logo2.png" alt="Logo" style="width:100px; height:auto" />
            </div>
          </div>

          <div class="items">
            <table>
              <thead><tr><th>Producto</th><th style="width:80px">Cantidad</th><th style="width:120px">Precio</th><th style="width:120px">Subtotal</th></tr></thead>
              <tbody>
                ${(order.items || []).map(it => `<tr>
                  <td>${it.name || it.productId}</td>
                  <td style="text-align:center">${it.qty || 1}</td>
                  <td style="text-align:right">$${Number(it.price || 0).toLocaleString()}</td>
                  <td style="text-align:right">$${Number((it.price || 0) * (it.qty || 1)).toLocaleString()}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>

          <div class="total">Total: $${Number(order.total || 0).toLocaleString()}</div>

          <div class="meta">
            <strong>Dirección / Nota:</strong>
            <div>${(order.note || '-').replace(/\n/g, '<br/>')}</div>
          </div>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (!w) { alert('Bloqueador de ventanas emergentes impide imprimir.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 300);
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-sm" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Compra exitosa 🎉</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-2">¡Tu compra fue registrada correctamente!</p>
            <p className="small text-muted">Boleta: <strong>#{order.id}</strong></p>
            <p className="small text-muted">Total: <strong>${Number(order.total || 0).toLocaleString()}</strong></p>
            <div className="d-grid gap-2 mt-2">
              <button className="btn btn-primary" onClick={handleViewTracking}>Ver tracking</button>
              <button className="btn btn-outline-secondary" onClick={handlePrint}>Imprimir boleta</button>
              <button className="btn btn-outline-dark" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}