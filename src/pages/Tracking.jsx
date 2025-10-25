import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readById, readAll } from '../data/usersCRUD';

export default function Tracking() {
  const { userId, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    // Intenta leer usuario por userId
    try {
      const u = readById(userId);
      if (u) {
        const o = (u.orders || []).find(x => String(x.id) === String(orderId));
        if (o) {
          setUser(u);
          setOrder({ ...o, userId: u.id, userName: u.nombre, userEmail: u.email });
          setWarning('');
          return;
        }
      }
    } catch (e) {
      // readById puede lanzar si userId no existe; lo ignoramos y seguimos buscando globalmente
    }

    // Si no encontramos, buscar la orden por id en todos los usuarios (fallback)
    try {
      const all = readAll();
      const found = all.flatMap(u => (u.orders || []).map(o => ({ ...o, userId: u.id, userName: u.nombre, userEmail: u.email })))
                       .find(o => String(o.id) === String(orderId));
      if (found) {
        setOrder(found);
        setUser({ id: found.userId, nombre: found.userName, email: found.userEmail });
        setWarning('La boleta no se encontró bajo el usuario especificado en la URL; se muestra la boleta encontrada en otra cuenta.');
        return;
      }
    } catch (err) {
      console.error('Error buscando orden globalmente', err);
    }

    // Si tampoco se encuentra la orden
    setOrder(null);
    setUser(null);
    setWarning('No se encontró la boleta. Verifica el link o que la compra se haya registrado correctamente.');
  }, [userId, orderId]);

  function statusToStep(status) {
    if (!status) return 0;
    const s = String(status).toLowerCase();
    if (s.includes('pend')) return 0;
    if (s.includes('proces')) return 1;
    if (s.includes('enviado')) return 2;
    if (s.includes('ruta') || s.includes('out')) return 3;
    if (s.includes('complet')) return 4;
    return 0;
  }

  if (!order) {
    return (
      <div>
        <h2>Tracking</h2>
        {warning ? <div className="alert alert-warning">{warning}</div> : <div className="alert alert-warning">No se encontró la boleta.</div>}
        <div className="mb-3">
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/admin/orders')}>Ir a admin (boletas)</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
        <div className="small text-muted">Si creaste la orden hace poco, espera unos segundos o recarga la página.</div>
      </div>
    );
  }

  const currentStep = statusToStep(order.status);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Tracking — Boleta #{order.id}</h2>
          <div className="small text-muted">{new Date(order.date).toLocaleString()} • {order.userName}</div>
          {warning && <div className="mt-2 alert alert-info">{warning}</div>}
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => window.print()}>Imprimir boleta</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/orders')}>Ver en Admin</button>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h5>Estado del envío</h5>
        <div className="d-flex gap-3 align-items-center mt-3">
          {['Ordenada', 'Procesando', 'Enviada', 'En ruta', 'Entregada'].map((label, idx) => (
            <div key={idx} className="text-center" style={{ minWidth: 90 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', lineHeight: '36px',
                background: idx <= currentStep ? '#0d6efd' : '#e9ecef', color: idx <= currentStep ? '#fff' : '#666', margin: '0 auto'
              }}>{idx + 1}</div>
              <div className="small mt-2" style={{ color: idx <= currentStep ? '#000' : '#666' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <strong>Estado actual:</strong> <span className="badge bg-info text-dark ms-2">{order.status || 'pendiente'}</span>
        </div>
      </div>

      <div className="card p-3">
        <h5>Detalle de la boleta</h5>
        <table className="table table-sm mt-2">
          <thead><tr><th>Producto</th><th className="text-center">Cant</th><th className="text-end">Precio</th><th className="text-end">Subtotal</th></tr></thead>
          <tbody>
            {(order.items || []).map((it, i) => (
              <tr key={i}>
                <td>{it.name || it.productId}</td>
                <td className="text-center">{it.qty || 1}</td>
                <td className="text-end">${Number(it.price || 0).toLocaleString()}</td>
                <td className="text-end">${Number((it.price || 0) * (it.qty || 1)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <div className="small text-muted">Dirección / Nota</div>
            <div>{order.note}</div>
          </div>
          <div className="text-end">
            <div className="small text-muted">Total</div>
            <div className="fs-5 fw-bold">${Number(order.total || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}