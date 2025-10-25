import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readAll } from '../data/productsCRUD';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // carga todos los productos desde la persistencia
    const all = readAll();

    // Prioriza productos en oferta y completa con otros hasta 3 items
    const offers = all.filter(p => p.offer);
    const rest = all.filter(p => !p.offer);
    const featured = [...offers, ...rest].slice(0, 3);

    setProducts(featured);
  }, []);

  return (
    <div>
      <section className="text-center py-5">
        <div className="container">
          <h1 className="mb-3">Bienvenido a mil sabores</h1>
          <p className="lead">Un lugar donde tradición y dulzura se encuentran 🍬</p>
        </div>
      </section>

      <main className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title">Productos destacados</h2>
          <Link to="/products" className="btn btn-outline-secondary btn-sm">Ver todos los productos</Link>
        </div>

        <div className="row g-4">
          {products.map(p => (
            <div className="col-md-4" key={p.id}>
              <article className="card h-100 shadow-sm">
                <img src={p.img} className="card-img-top" alt={p.title} />
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text">{p.description}</p>
                  <p className="fw-bold">${p.price.toLocaleString()}</p>
                  <Link to={`/product/${p.id}`} className="btn btn-custom">Ver detalle</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}