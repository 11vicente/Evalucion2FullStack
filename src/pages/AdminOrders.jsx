import React, { useEffect, useMemo, useState } from 'react';
import {
  readAll as readUsers,
  updateOrder,
  removeOrder,
  addAttachmentToOrder
} from '../data/usersCRUD';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { exportToCsv } from '../utils/exportCsv';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
    function onUsers() { load(); }
    window.addEventListener('users-updated', onUsers);
    return () => window.removeEventListener('users-updated', onUsers);
  }, []);

  function collectOrders() {
    // lee todos los usuarios y aplanar sus órdenes con metadatos de usuario
    const users = readUsers();
    const all = [];
    users.forEach(u => {
      (u.orders || []).forEach(o => {
        all.push({
          ...o,
          userId: u.id,
          userName: u.nombre,
          userEmail: u.email
        });
      });
    });
    // ordenar por fecha descendente
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    return all;
  }

  function load() {
    setOrders(collectOrders());
  }

  const statuses = useMemo(() => {
    const s = new Set(orders.map(o => o.status || 'pendiente'));
    return ['todos', ...Array.from(s)];
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filterStatus && filterStatus !== 'todos') {
      list = list.filter(o => (o.status || 'pendiente') === filterStatus);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o.id).includes(q) ||
        (o.userName || '').toLowerCase().includes(q) ||
        (o.userEmail || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filterStatus, search]);

  async function handleChangeStatus(order) {
    const newStatus = prompt('Nuevo estado', order.status || 'pendiente');
    if (!newStatus) return;
    try {
      await updateOrder(order.userId, order.id, { status: newStatus });
      load();
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error al actualizar estado');
    }
  }

  function handleDelete(order) {
    if (!window.confirm(`Eliminar boleta ${order.id} de ${order.userName}?`)) return;
    try {
      removeOrder(order.userId, order.id);
      load();
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  }

  function handleAddAttachment(order) {
    const url = prompt('Pega la URL del adjunto (imagen / PDF)');
    if (!url) return;
    const name = url.split('/').pop();
    try {
      addAttachmentToOrder(order.userId, order.id, { url, name });
      load();
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error al agregar adjunto');
    }
  }

  function handleView(order) {
    setSelected(order);
  }

  function handleExportVisible() {
    const rows = filtered.map(o => ({
      orderId: o.id,
      date: o.date,
      status: o.status,
      total: o.total || 0,
      userId: o.userId,
      userName: o.userName,
      userEmail: o.userEmail,
      items: JSON.stringify(o.items || [])
    }));
    exportToCsv('boletas_filtradas.csv', rows);
  }

  function handlePrint(order) {
    // Genera HTML simple y abre ventana para imprimir
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
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>Boleta #${order.id}</h2>
              <div>Fecha: ${new Date(order.date).toLocaleString()}</div>
              <div>Cliente: ${order.userName} &lt;${order.userEmail}&gt;</div>
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
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (!w) { alert('Bloqueador de ventanas emergentes impide imprimir.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); /* w.close(); */ }, 300);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Boletas / Órdenes</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={load}>Refrescar</button>
          <button className="btn btn-sm btn-success" onClick={handleExportVisible}>Exportar visibles (CSV)</button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ width: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <input className="form-control form-control-sm" placeholder="Buscar por id/usuario/email" value={search} onChange={e => setSearch(e.target.value)} />

      </div>

      <div className="list-group">
        {filtered.length === 0 ? (
          <div className="alert alert-info">No hay boletas que coincidan.</div>
        ) : filtered.map(o => (
          <div key={o.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-semibold">Boleta #{o.id} — {o.userName}</div>
              <div className="small text-muted">{new Date(o.date).toLocaleString()} • {o.userEmail}</div>
              <div className="small text-muted">Items: {(o.items||[]).length} • Total: ${Number(o.total||0).toLocaleString()}</div>
            </div>

            <div className="d-flex flex-column align-items-end">
              <div className="mb-2">
                <span className="badge bg-secondary text-capitalize">{o.status || 'pendiente'}</span>
              </div>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleView(o)}>Ver</button>
                <button className="btn btn-sm btn-outline-warning" onClick={() => handleChangeStatus(o)}>Estado</button>
                <button className="btn btn-sm btn-outline-info" onClick={() => handleAddAttachment(o)}>Adjunto</button>
                <button className="btn btn-sm btn-outline-success" onClick={() => handlePrint(o)}>Imprimir</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <OrderDetailsModal
          order={selected}
          onClose={() => setSelected(null)}
          onChangeStatus={(status) => {
            updateOrder(selected.userId, selected.id, { status });
            setSelected({ ...selected, status });
            setOrders(collectOrders());
            window.dispatchEvent(new Event('users-updated'));
          }}
          onAddAttachment={(a) => {
            addAttachmentToOrder(selected.userId, selected.id, a);
            setSelected(readUpdatedOrder(selected.userId, selected.id));
            setOrders(collectOrders());
            window.dispatchEvent(new Event('users-updated'));
          }}
          onDeleteAttachment={(a) => {
            // eliminar attachment simple (por url)
            const users = readUsers();
            const u = users.find(us => us.id === selected.userId);
            if (!u) return;
            const o = (u.orders || []).find(x => x.id === selected.id);
            if (!o) return;
            o.attachments = (o.attachments || []).filter(at => at.url !== a.url);
            // save via updateOrder
            updateOrder(selected.userId, selected.id, { attachments: o.attachments });
            setSelected(readUpdatedOrder(selected.userId, selected.id));
            setOrders(collectOrders());
            window.dispatchEvent(new Event('users-updated'));
          }}
        />
      )}
    </div>
  );

  // helper local para leer la orden recién actualizada
  function readUpdatedOrder(userId, orderId) {
    const users = readUsers();
    const u = users.find(us => us.id === userId);
    if (!u) return null;
    const o = (u.orders || []).find(x => x.id === orderId);
    if (!o) return null;
    return { ...o, userId: u.id, userName: u.nombre, userEmail: u.email };
  }
}