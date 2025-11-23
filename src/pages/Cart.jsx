import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { readById } from "../data/productsCRUD";
import { addOrder } from "../data/usersCRUD";
import CheckoutModal from "../components/CheckoutModal";
import OrderSuccessModal from "../components/OrderSuccessModal";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function Cart() {
  const { items, updateQty, remove, clear, applyCoupon, totals, coupon } = useCart();

  const [productCache, setProductCache] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [couponInput, setCouponInput] = useState(coupon?.code || "");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  // ======================
  // 🔥 CARGA DE PRODUCTOS
  // ======================
  useEffect(() => {
    async function loadProducts() {
      if (!items || items.length === 0) {
        setLoadingProducts(false);
        return;
      }

      const map = {};

      for (const it of items) {
        try {
          const p = await readById(it.id);
          map[it.id] = p;
        } catch (e) {
          console.error("Error loading product", it.id);
        }
      }

      setProductCache(map);
      setLoadingProducts(false);
    }

    loadProducts();
  }, [items]);

  if (loadingProducts) return <div>Cargando carrito...</div>;

  const t = totals ? totals() : { subtotal: 0, descuento: 0, envio: 0, total: 0 };

  function handleApplyCoupon() {
    const res = applyCoupon(couponInput);
    alert(res?.msg || "Cupón aplicado");
  }

  function handleStartCheckout() {
    const user = JSON.parse(localStorage.getItem("ms_current_user") || "null");
    if (!user) {
      alert("Debes iniciar sesión para finalizar la compra.");
      return navigate("/login");
    }
    setShowCheckout(true);
  }

  // ======================
  // 🔥 CONFIRMAR COMPRA
  // ======================
  async function handleConfirmCheckout(address) {
    setShowCheckout(false);
    setProcessing(true);

    const orderItems = items.map((it) => {
      const p = productCache[it.id];
      return {
        productId: it.id,
        name: p.title,
        price: p.price,
        qty: it.qty,
      };
    });

    const order = {
      items: orderItems,
      total: t.total,
      note: `Dirección: ${address.calle} ${address.numero}, ${address.comuna} (${address.region}), Tel: ${address.telefono}. ${address.instrucciones}`,
    };

    const user = JSON.parse(localStorage.getItem("ms_current_user") || "null");

    try {
      const saved = addOrder(user.id, order);
      clear();
      setProcessing(false);

      setCreatedOrder({
        ...saved,
        userName: user.nombre,
        userEmail: user.email,
        userId: user.id,
      });

      setShowSuccess(true);
    } catch (e) {
      setProcessing(false);
      alert("Error al guardar la boleta: " + e);
    }
  }

  // ======================
  // 🔥 RENDER
  // ======================
  return (
    <div>
      <h1 className="h3 mb-4">🛒 Carrito de compras</h1>

      {items.length === 0 ? (
        <div className="alert alert-info">
          Tu carrito está vacío. <a href="/">Explorar productos</a>.
        </div>
      ) : (
        <div className="row g-4">

          {/* ====================== */}
          {/* LISTADO DE PRODUCTOS   */}
          {/* ====================== */}
          <div className="col-lg-8">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((it) => {
                  const p = productCache[it.id];
                  return (
                    <tr key={it.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.img}
                            alt={p.title}
                            style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6 }}
                          />
                          <strong>{p.title}</strong>
                        </div>
                      </td>

                      <td className="text-center">{CLP.format(p.price)}</td>

                      <td className="text-center">
                        <button onClick={() => updateQty(it.id, it.qty - 1)} className="btn btn-sm btn-light">-</button>
                        <span className="mx-2">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, it.qty + 1)} className="btn btn-sm btn-light">+</button>
                      </td>

                      <td className="text-end fw-bold">
                        {CLP.format(p.price * it.qty)}
                      </td>

                      <td className="text-end">
                        <button onClick={() => remove(it.id)} className="btn btn-sm btn-outline-danger">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button className="btn btn-outline-danger" onClick={clear}>
              Vaciar carrito
            </button>
          </div>

          {/* ====================== */}
          {/* RESUMEN DEL PEDIDO     */}
          {/* ====================== */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4>Resumen</h4>

                <hr />

                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <strong>{CLP.format(t.subtotal)}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Descuento</span>
                  <strong>-{CLP.format(t.descuento)}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Envío</span>
                  <strong>{CLP.format(t.envio)}</strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between fs-5">
                  <span>Total</span>
                  <strong>{CLP.format(t.total)}</strong>
                </div>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleStartCheckout}
                  disabled={processing}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal show={showCheckout} onClose={() => setShowCheckout(false)} onConfirm={handleConfirmCheckout} />

      <OrderSuccessModal show={showSuccess} order={createdOrder} onClose={() => { setShowSuccess(false); setCreatedOrder(null); }} />
    </div>
  );
}
