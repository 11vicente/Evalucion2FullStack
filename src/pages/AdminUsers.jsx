import React, { useEffect, useState } from "react";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleAdmin,
} from "../data/usersCRUD";
import UserModal from "../components/UserModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios");
    }
  }

  function openCreate() {
    setEditingUser(null);
    setModalOpen(true);
  }

  async function openEdit(id) {
    try {
      const u = await getUser(id);
      setEditingUser(u);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el usuario");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar usuario");
    }
  }

  async function handleToggleAdmin(id) {
    try {
      await toggleAdmin(id);
      load();
    } catch (err) {
      console.error(err);
      setError("Error al cambiar rol");
    }
  }

  async function handleSave(formData) {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          nombre: formData.nombre,
          email: formData.email,
          isAdmin: !!formData.isAdmin,
        });
      } else {
        await createUser({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password || "123456",
          isAdmin: !!formData.isAdmin,
        });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar");
      throw err;
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Usuarios</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={openCreate}>
            Crear usuario
          </button>
          <button className="btn btn-outline-secondary" onClick={load}>
            Actualizar
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "ADMIN" : "USUARIO"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(u.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning me-2"
                    onClick={() => handleToggleAdmin(u.id)}
                  >
                    {u.isAdmin ? "Quitar admin" : "Hacer admin"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(u.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-muted text-center">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
