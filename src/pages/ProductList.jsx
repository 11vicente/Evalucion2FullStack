import React, { useEffect, useState } from 'react';
import { readAll} from '../data/productsCRUD';
import { readById } from '../data/productsCRUD';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const all = await readAll();
        if (mounted) {
          setProducts(Array.isArray(all) ? all : []);
        }
      } catch (err) {
        console.error('Error cargando productos', err);
        if (mounted) setError(err.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">ERROR: {error}</div>;

  return (
    <div className="row g-4">
      {products.map(p => (
        <div className="col-md-4" key={p.id}>
          <article className="card h-100 shadow-sm">
            <img src={p.img} className="card-img-top" alt={p.title} />
            <div className="card-body">
              <h5 className="card-title">{p.title}</h5>
              <p className="card-text">{p.description}</p>
              <p className="fw-bold">${Number(p.price || 0).toLocaleString()}</p>
              <Link to={`/product/${p.id}`} className="btn btn-custom">Ver detalle</Link>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}