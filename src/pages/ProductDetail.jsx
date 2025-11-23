// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readById } from '../data/productsCRUD';
import useCart from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar producto desde API real
  useEffect(() => {
    async function load() {
      try {
        const res = await readById(id);
        setProduct(res);
      } catch (e) {
        console.error("Error cargando producto", e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <h3>Cargando producto...</h3>;
  if (!product) return <h3>Producto no encontrado.</h3>;

  function handleAdd() {
    add(product.id, 1);
    navigate('/cart');
  }

  return (
    <div className="row">
      <div className="col-md-6">
        {/* IMG siempre con fallback */}
        <img
          src={product.img || "/img/default.png"}
          className="img-fluid"
          alt={product.title}
        />
      </div>

      <div className="col-md-6">
        <h2>{product.title}</h2>
        <p>{product.description}</p>

        <p className="fw-bold">
          ${Number(product.price).toLocaleString('es-CL')}
        </p>

        <button className="btn btn-success" onClick={handleAdd}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
