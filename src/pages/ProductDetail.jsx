import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById } from '../data/productsData';
import useCart from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getById(id);
  const { add } = useCart();

  if (!product) return <div>Producto no encontrado.</div>;

  function handleAdd() {
    add(product.id, 1);
    navigate('/cart');
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={product.img} className="img-fluid" alt={product.title} />
      </div>
      <div className="col-md-6">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p className="fw-bold">${product.price.toLocaleString()}</p>
        <button className="btn btn-success" onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  );
}