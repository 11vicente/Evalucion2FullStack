import React, { useEffect, useState } from "react";
import {
  getUsers,
  getOrdersByUser,
  getOrder,
  updateOrder,
  removeOrder,
} from "../data/usersCRUD";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function AdminOrders() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios");
    }
  }

  async function loadOrders(userId) {
    setError("");
    try {
      const data = await getOrdersByUser(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar órdenes");
    }
  }

  async function openOrder(orderId) {
    setError("");
    try {
      const o = await getOrder(orderId);
      setModalOrder(o);
    } catch (err) {
      console.error(err);
      setError("Error al cargar detalle de la orden");
    }
  }

  async function handleChangeStatus(newStatus) {
    if (!modalOrder || !selectedUserId) return;
    try {
      const updated = await updateOrder(selectedUserId, modalOrder.id, newStatus);
      setModalOrder(updated);
      loadOrders(selectedUserId);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar estado");
    }
  }

  async function handleDelete(orderId) {
    if (!selectedUserId) return;
    if (!window.confirm("¿Eliminar esta orden?")) return;
    try {
      await removeOrder(selectedUserId, orderId);
      loadOrders(selectedUserId);
    } catch (err) {
      console.error(err);
      setError("Error al eliminar orden");
    }
  }

  return (
    <div>
      <h1 className="mb-3">Órdenes</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* selector de usuario */}
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <select
          className="form-select"
          value={selectedUserId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedUserId(id);
            if (id) loadOrders(id);
            else setOrders([]);
          }}
        >
          <option value="">-- Selecciona un usuario --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.id} — {u.nombre} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* tabla de órdenes */}
      {orders.length === 0 ? (
        <div className="text-muted">No hay órdenes para este usuario.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.date ? new Date(o.date).toLocaleString() : ""}</td>
                  <td>{o.status}</td>
                  <td>${Number(o.total || 0).toLocaleString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openOrder(o.id)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(o.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOrder && (
        <OrderDetailsModal
          order={modalOrder}
          onClose={() => setModalOrder(null)}
          onChangeStatus={handleChangeStatus}
          // onAddAttachment / onDeleteAttachment omitidos (tú dijiste quitar adjuntos)
        />
      )}
    </div>
  );
}
