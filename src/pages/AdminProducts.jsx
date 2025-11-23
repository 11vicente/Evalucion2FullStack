import React, { useEffect, useState } from "react";
import request from "../utils/request";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError("");
    try {
      const data = await request("/api/products", { method: "GET" });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar productos");
    }
  }

  function startCreate() {
    setEditing(null);
    setForm({ name: "", price: 0, stock: 0, category: "" });
  }

  function startEdit(p) {
    setEditing(p);
    setForm({
      name: p.name || "",
      price: p.price || 0,
      stock: p.stock || 0,
      category: p.category || "",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await request(`/api/products/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await request("/api/products", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      startCreate();
      load();
    } catch (err) {
      console.error(err);
      setError("Error al guardar producto");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await request(`/api/products/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar producto");
    }
  }

  return (
    <div>
      <h1 className="mb-3">Productos</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5 className="mb-3">
          {editing ? `Editar producto #${editing.id}` : "Crear producto"}
        </h5>
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Precio</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              min="0"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={form.stock}
              min="0"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Categoría</label>
            <input
              className="form-control"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${Number(p.price || 0).toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>{p.category}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => startEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
