// Función pura para calcular totales, fácil de testear.
// products: array de productos {id, price}
// items: array { id, qty }
// coupon: null o { type: 'porcentaje'|'fijo', factor?, amount? }

export function calculateTotals(products, items, coupon = null) {
  const subtotal = items.reduce((acc, it) => {
    const p = products.find(pp => pp.id === Number(it.id));
    return acc + (p ? p.price * (it.qty || 0) : 0);
  }, 0);

  let descuento = 0;
  if (coupon) {
    if (coupon.type === 'porcentaje') descuento = Math.round(subtotal * (coupon.factor || 0));
    else if (coupon.type === 'fijo') descuento = coupon.amount || 0;
    descuento = Math.min(descuento, subtotal);
  }

  const envio = subtotal > 30000 ? 0 : 3000;
  const total = subtotal - descuento + envio;
  return { subtotal, descuento, envio, total };
}