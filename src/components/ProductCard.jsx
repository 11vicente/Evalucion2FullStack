import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card h-100 shadow-sm">
      <img src={product.img} className="card-img-top" alt={product.title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">{product.description}</p>
        <p className="fw-bold mt-auto">${product.price.toLocaleString()}</p>
        <div className="d-flex gap-2 mt-2">
          <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm">Ver detalle</Link>
          <button className="btn btn-custom btn-sm" onClick={() => onAdd && onAdd(product.id)}>Añadir al carrito</button>
        </div>
      </div>
    </article>
  );
}