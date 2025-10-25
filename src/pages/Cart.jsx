import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { addOrder } from '../data/usersCRUD';
import CheckoutModal from '../components/CheckoutModal';
import OrderSuccessModal from '../components/OrderSuccessModal';
import getById from '../data/productsData'; // si tu module exporta getById como default o named, ajusta

// Si productsData exporta named getById, usa:
// import { getById } from '../data/productsData';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function Cart() {
  // usa la API que ya tenías en tu hook
  const { items, updateQty, remove, clear, applyCoupon, totals, coupon } = useCart();
  const [couponInput, setCouponInput] = useState(coupon?.code || '');
  const t = totals ? totals() : { subtotal: 0, descuento: 0, envio: 0, total: 0 };

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  function handleApplyCoupon() {
    if (!applyCoupon) return alert('Función de cupón no disponible.');
    const res = applyCoupon(couponInput);
    alert(res?.msg || 'Cupón aplicado');
  }

  function handleStartCheckout() {
    if (!items || items.length === 0) {
      alert('🛒 Tu carrito está vacío.');
      return;
    }
    // comprobar usuario
    const cu = (() => { try { return JSON.parse(localStorage.getItem('ms_current_user') || 'null'); } catch { return null; } })();
    if (!cu) {
      alert('Debes iniciar sesión para finalizar la compra.');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  }

  async function handleConfirmCheckout(address) {
    // address viene del modal
    setShowCheckout(false);
    setProcessing(true);

    // simulación de pago (pequeña espera)
    await new Promise(r => setTimeout(r, 700));
    const success = Math.random() < 0.85;

    if (!success) {
      setProcessing(false);
      alert('Ocurrió un error procesando el pago. Intenta nuevamente.');
      return;
    }

    // construir items para la boleta
    const orderItems = (items || []).map(it => {
      // obtener producto real para nombre/price si existe
      let prod;
      try {
        // si exportas getById como función named:
        prod = (typeof getById === 'function') ? getById(it.id) : undefined;
      } catch (e) {
        prod = undefined;
      }
      return {
        productId: it.id,
        name: (prod && (prod.title || prod.name)) || it.title || it.name || `Producto ${it.id}`,
        qty: it.qty || 1,
        price: (prod && prod.price) || it.price || 0
      };
    });

    const order = {
      items: orderItems,
      total: t.total || orderItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0),
      note: `Dirección: ${address.calle} ${address.numero || ''}, ${address.comuna} (${address.region || ''}). Tel: ${address.telefono}. ${address.instrucciones || ''}`
    };

    const cu = JSON.parse(localStorage.getItem('ms_current_user') || 'null');
    if (!cu) {
      setProcessing(false);
      alert('No se encontró usuario actual, por favor inicia sesión.');
      navigate('/login');
      return;
    }

    try {
      const created = addOrder(cu.id, order);
      window.dispatchEvent(new Event('users-updated'));
      // vaciar carrito
      clear && clear();
      setCreatedOrder({ ...created, userName: cu.nombre, userEmail: cu.email, userId: cu.id });
      setShowSuccess(true);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alert('Error al guardar la boleta: ' + (err.message || err));
    }
  }

  function handleFinalizeSimple() {
    // modo "simple" si prefieres mantener el comportamiento anterior (sin modal)
    if (!items || items.length === 0) {
      alert('🛒 Tu carrito está vacío.');
      return;
    }
    alert('✅ ¡Compra realizada con éxito! 🎉 Gracias por tu pedido.');
    clear();
  }

  return (
    <div>
      <h1 className="h3 mb-4">🛒 Carrito de compras</h1>

      {(!items || items.length === 0) ? (
        <div className="alert alert-info">Tu carrito está vacío. <a href="/">Explorar productos</a>.</div>
      ) : (
        <div className="row g-4">
          <section className="col-lg-8">
            <div className="table-responsive">
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
                  {items.map(it => {
                    // obtener producto para mostrar imagen y precio
                    let prod;
                    try {
                      prod = (typeof getById === 'function') ? getById(it.id) : require('../data/productsData').getById(it.id);
                    } catch (e) {
                      prod = undefined;
                    }
                    const title = (prod && prod.title) || it.title || it.name || `Producto ${it.id}`;
                    const price = (prod && prod.price) || it.price || 0;
                    return (
                      <tr key={it.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {prod && prod.img ? <img src={prod.img} className="cart-thumb" alt={title} /> : null}
                            <div>
                              <div className="fw-semibold">{title}</div>
                              <small className="text-muted">ID: {it.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{CLP.format(price)}</td>
                        <td className="text-center">
                          <div className="d-inline-flex align-items-center border rounded-2 overflow-hidden">
                            <button className="btn btn-sm btn-light" onClick={() => updateQty(it.id, Math.max(1, (it.qty || 1) - 1))}>−</button>
                            <input className="form-control form-control-sm text-center" style={{ width: 56 }} value={it.qty || 1} onChange={(e) => updateQty(it.id, Number(e.target.value || 1))} />
                            <button className="btn btn-sm btn-light" onClick={() => updateQty(it.id, (it.qty || 1) + 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-end fw-semibold">{CLP.format(price * (it.qty || 1))}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it.id)}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={() => { clear(); }}>Vaciar carrito</button>
              <a href="/" className="btn btn-outline-secondary">Seguir comprando</a>
            </div>
          </section>

          <aside className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h2 className="h5 mb-3">Resumen</h2>

                <div className="mb-3">
                  <label className="form-label">Cupón de descuento</label>
                  <div className="input-group">
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value)} type="text" className="form-control" placeholder="Ej: FELICES10" />
                    <button onClick={handleApplyCoupon} className="btn btn-outline-primary">Aplicar</button>
                  </div>
                </div>

                <ul className="list-unstyled mb-3">
                  <li className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>{CLP.format(t.subtotal)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Descuento</span>
                    <strong>-{CLP.format(t.descuento)}</strong>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Envío</span>
                    <strong>{CLP.format(t.envio)}</strong>
                  </li>
                  <hr/>
                  <li className="d-flex justify-content-between fs-5">
                    <span>Total</span>
                    <strong>{CLP.format(t.total)}</strong>
                  </li>
                </ul>

                <button onClick={handleStartCheckout} className="btn btn-primary w-100" disabled={processing}>
                  {processing ? 'Procesando...' : 'Finalizar compra'}
                </button>

                {/* botón alternativo simple (como tu handleFinalize viejo) */}
                {/* <button onClick={handleFinalizeSimple} className="btn btn-primary w-100">Finalizar compra</button> */}
              </div>
            </div>
          </aside>
        </div>
      )}

      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
        onConfirm={handleConfirmCheckout}
      />

      <OrderSuccessModal
        show={showSuccess}
        order={createdOrder}
        userId={createdOrder ? createdOrder.userId : undefined}
        onClose={() => { setShowSuccess(false); setCreatedOrder(null); }}
      />
    </div>
  );
}