import React, { useEffect, useState } from 'react';
import { readAll, readById, update, remove, getOrders, updateOrder, removeOrder, addAttachmentToOrder, exportAllOrders } from '../data/usersCRUD';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { exportToCsv } from '../utils/exportCsv';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    load();
    function onUsers() { load(); }
    window.addEventListener('users-updated', onUsers);
    return () => window.removeEventListener('users-updated', onUsers);
  }, []);

  function load() {
    setUsers(readAll());
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({ ...user });
    setOrders(getOrders(user.id));
  }

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSave(e) {
    e.preventDefault();
    try {
      update(editingId, form);
      window.dispatchEvent(new Event('users-updated'));
      setEditingId(null);
      setForm({});
      alert('Usuario actualizado');
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  function handleDelete(id) {
    if (!window.confirm('Eliminar usuario?')) return;
    try {
      remove(id);
      window.dispatchEvent(new Event('users-updated'));
      alert('Usuario eliminado');
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  function handleToggleAdmin(user) {
    try {
      update(user.id, { isAdmin: !user.isAdmin });
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  // Orders management
  function handleViewOrder(order) {
    setSelectedOrder(order);
  }

  async function handleChangeOrderStatus(orderId, status) {
    try {
      updateOrder(editingId, orderId, { status });
      setOrders(getOrders(editingId));
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  function handleDeleteOrder(orderId) {
    if (!window.confirm('Eliminar orden?')) return;
    try {
      removeOrder(editingId, orderId);
      setOrders(getOrders(editingId));
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  function handleAddAttachmentToOrder(orderId, attachment) {
    try {
      addAttachmentToOrder(editingId, orderId, attachment);
      setOrders(getOrders(editingId));
      window.dispatchEvent(new Event('users-updated'));
    } catch (err) {
      alert(err.message || 'Error');
    }
  }

  function handleDeleteAttachment(orderId, attachment) {
    const userOrders = getOrders(editingId);
    const o = userOrders.find(o => o.id === orderId);
    if (!o) return;
    o.attachments = (o.attachments || []).filter(a => a.url !== attachment.url);
    updateOrder(editingId, orderId, { attachments: o.attachments });
    setOrders(getOrders(editingId));
    window.dispatchEvent(new Event('users-updated'));
  }

  function handleExportUserOrders() {
    const rows = (getOrders(editingId) || []).map(o => ({
      orderId: o.id,
      date: o.date,
      status: o.status,
      total: o.total || 0,
      items: JSON.stringify(o.items || [])
    }));
    exportToCsv(`orders_user_${editingId}.csv`, rows);
  }

  function handleExportAllOrders() {
    const rows = exportAllOrders();
    exportToCsv('orders_all_users.csv', rows);
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <h3>Usuarios</h3>
        <div className="mb-2 d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => { load(); }}>Refrescar</button>
          <button className="btn btn-sm btn-outline-success" onClick={handleExportAllOrders}>Exportar todas las órdenes (CSV)</button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Región</th><th>Comuna</th><th>Admin</th><th>Órdenes</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.edad}</td>
                  <td>{u.region}</td>
                  <td>{u.comuna}</td>
                  <td>{u.isAdmin ? 'Sí' : 'No'}</td>
                  <td>{(u.orders || []).length}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(u)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="col-md-4">
        <div className="card p-3">
          {editingId ? <h5>Editar Usuario</h5> : <h5>Seleccione un usuario para editar</h5>}
          {editingId ? (
            <form onSubmit={handleSave}>
              <div className="mb-2">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="nombre" value={form.nombre || ''} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input className="form-control" name="email" value={form.email || ''} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Edad</label>
                <input className="form-control" name="edad" type="number" value={form.edad || ''} onChange={handleChange} />
              </div>
              <div className="mb-2 form-check">
                <input id="isAdmin" className="form-check-input" type="checkbox" name="isAdmin" checked={!!form.isAdmin} onChange={handleChange} />
                <label htmlFor="isAdmin" className="form-check-label">Es administrador</label>
              </div>
              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary" type="submit">Guardar</button>
                <button className="btn btn-secondary" type="button" onClick={() => { setEditingId(null); setForm({}); }}>Cancelar</button>
              </div>

              <hr />

              <h6>Historial de compras</h6>
              {orders.length === 0 ? <p className="text-muted">Sin órdenes</p> : (
                <>
                  <div className="list-group mb-2">
                    {orders.map(o => (
                      <div key={o.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-semibold">Orden #{o.id}</div>
                          <div className="small text-muted">{new Date(o.date).toLocaleString()}</div>
                          <div className="small text-muted">Total: ${Number(o.total || 0).toLocaleString()}</div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <select className="form-select form-select-sm mb-2" value={o.status || 'pendiente'} onChange={(e) => handleChangeOrderStatus(o.id, e.target.value)}>
                            <option value="pendiente">Pendiente</option>
                            <option value="procesando">Procesando</option>
                            <option value="enviado">Enviado</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                          <div className="d-flex gap-1">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleViewOrder(o)}>Ver</button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOrder(o.id)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { setOrders(getOrders(editingId)); }}>Refrescar órdenes</button>
                    <button className="btn btn-sm btn-success" onClick={handleExportUserOrders}>Exportar órdenes (CSV)</button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <p className="text-muted">Haz clic en "Editar" en la lista para modificar un usuario y ver su historial.</p>
          )}
        </div>
      </aside>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChangeStatus={(status) => {
            handleChangeOrderStatus(selectedOrder.id, status);
            const updated = updateOrder(editingId, selectedOrder.id, { status });
            setSelectedOrder(updated);
            setOrders(getOrders(editingId));
          }}
          onAddAttachment={(a) => {
            handleAddAttachmentToOrder(selectedOrder.id, a);
            setSelectedOrder(readById(editingId).orders.find(o => o.id === selectedOrder.id));
            setOrders(getOrders(editingId));
          }}
          onDeleteAttachment={(a) => {
            handleDeleteAttachment(selectedOrder.id, a);
            setSelectedOrder(readById(editingId).orders.find(o => o.id === selectedOrder.id));
            setOrders(getOrders(editingId));
          }}
        />
      )}
    </div>
  );
}