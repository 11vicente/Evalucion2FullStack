import React, { useEffect, useState } from "react";
import { getUsers, exportAllOrders } from "../data/usersCRUD";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [exportMsg, setExportMsg] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  }

  async function handleExport() {
    setExportMsg("");
    try {
      const report = await exportAllOrders();
      console.log("REPORTE EXPORTADO:", report);
      setExportMsg("Reporte generado. Revisa la consola del navegador.");
    } catch (err) {
      console.error("Error exportando órdenes:", err);
      setExportMsg("Error al exportar órdenes.");
    }
  }

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.isAdmin).length;

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Total de usuarios</h5>
            <div className="display-6">{totalUsers}</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Administradores</h5>
            <div className="display-6">{totalAdmins}</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Reportes</h5>
            <button className="btn btn-primary" onClick={handleExport}>
              Exportar órdenes
            </button>
            {exportMsg && <div className="small mt-2">{exportMsg}</div>}
          </div>
        </div>
      </div>

      <h4>Usuarios recientes</h4>
      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "ADMIN" : "USUARIO"}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-muted text-center">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
