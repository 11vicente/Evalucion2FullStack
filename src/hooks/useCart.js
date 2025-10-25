import { useEffect, useState } from 'react';
import { getById } from '../data/productsData';

const STORAGE_KEY = 'carrito_ms';
const CUPON_KEY = 'cupon_ms';

export default function useCart() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  const [coupon, setCoupon] = useState(() => JSON.parse(localStorage.getItem(CUPON_KEY)) || null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(CUPON_KEY, JSON.stringify(coupon));
  }, [coupon]);

  function add(productId, qty = 1) {
    setItems(prev => {
      const exists = prev.find(i => i.id === productId);
      if (exists) return prev.map(i => i.id === productId ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: productId, qty }];
    });
  }

  function updateQty(productId, qty) {
    qty = Math.max(1, Number(qty) || 1);
    setItems(prev => prev.map(i => i.id === productId ? { ...i, qty } : i));
  }

  function remove(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  function clear() {
    setItems([]);
    setCoupon(null);
  }

  function applyCoupon(code) {
    const c = (code || '').trim().toUpperCase();
    if (!c) { setCoupon(null); return { ok: true, msg: 'Cupón borrado' }; }
    if (c === 'FELICES10') { setCoupon({ code: c, type: 'porcentaje', factor: 0.10 }); return { ok: true, msg: '10% aplicado' }; }
    if (c === 'TORTA5') { setCoupon({ code: c, type: 'fijo', amount: 5000 }); return { ok: true, msg: '$5.000 aplicado' }; }
    setCoupon(null); return { ok: false, msg: 'Cupón inválido' };
  }

  function totals() {
    const subtotal = items.reduce((acc, it) => {
      const p = getById(it.id);
      return acc + (p ? p.price * it.qty : 0);
    }, 0);

    let descuento = 0;
    if (coupon) {
      descuento = coupon.type === 'porcentaje' ? Math.round(subtotal * coupon.factor) : coupon.amount || 0;
      descuento = Math.min(descuento, subtotal);
    }

    const envio = subtotal > 30000 ? 0 : 3000;
    const total = subtotal - descuento + envio;
    return { subtotal, descuento, envio, total };
  }

  return { items, coupon, add, updateQty, remove, clear, applyCoupon, totals };
}