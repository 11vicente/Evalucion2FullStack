import React, { useEffect, useState } from 'react';
import { readAll, create, update, remove } from '../data/productsCRUD';

function EmptyForm() {
  return { title: '', price: 0, img: '/img/placeholder.png', description: '', category: '', stock: 0, offer: false };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EmptyForm());
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProducts(readAll());
  }, []);

  function refresh() {
    setProducts(readAll());
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'stock') ? Number(value) : value }));
  }

  function handleEdit(p) {
    setEditingId(p.id);
    setForm({ ...p });
    setMessage('');
  }

  function handleDelete(id) {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      remove(id);
      refresh();
      setMessage('Producto eliminado');
    } catch (err) {
      setMessage(err.message || 'Error al eliminar');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        update(editingId, form);
        setMessage('Producto actualizado');
      } else {
        create(form);
        setMessage('Producto creado');
      }
      setForm(EmptyForm());
      setEditingId(null);
      refresh();
    } catch (err) {
      setMessage(err.message || 'Error');
    }
  }

  return (
    <div className="row">
      <aside className="col-md-4">
        <div className="card p-3">
          <h5>{editingId ? 'Editar producto' : 'Nuevo producto'}</h5>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">Título</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Precio</label>
              <input className="form-control" name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Imagen (ruta)</label>
              <input className="form-control" name="img" value={form.img} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Categoría</label>
              <input className="form-control" name="category" value={form.category} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Stock</label>
              <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleChange} />
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" name="offer" checked={form.offer} onChange={handleChange} />
              <label className="form-check-label">En oferta</label>
            </div>
            <div className="mb-2">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setForm(EmptyForm()); setEditingId(null); setMessage(''); }}>Cancelar</button>
            </div>
          </form>
        </div>
      </aside>

      <section className="col-md-8">
        <h3>Productos (Admin)</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Título</th><th>Precio</th><th>Stock</th><th>Oferta</th><th></th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.offer ? 'Sí' : 'No'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}