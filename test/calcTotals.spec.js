// test/calcTotals.spec.js
import { calculateTotals } from '../src/utils/calcTotals';

describe('calculateTotals', () => {
  const products = [
    { id: 1, price: 1000 },
    { id: 2, price: 2000 },
    { id: 3, price: 5000 }
  ];

  it('calcula totales sin cupón', () => {
    const items = [{ id: 1, qty: 2 }, { id: 2, qty: 1 }];
    const res = calculateTotals(products, items, null);
    // subtotal = 1000*2 + 2000*1 = 4000, envio = 3000, total = 7000
    expect(res.subtotal).toBe(4000);
    expect(res.envio).toBe(3000);
    expect(res.total).toBe(7000);
  });

  it('aplica cupón porcentaje correctamente', () => {
    const items = [{ id: 3, qty: 7 }]; // subtotal 35000
    const coupon = { type: 'porcentaje', factor: 0.1 }; // 10%
    const res = calculateTotals(products, items, coupon);
    // subtotal 35000, descuento 3500, envio 0, total = 31500
    expect(res.subtotal).toBe(35000);
    expect(res.descuento).toBe(3500);
    expect(res.envio).toBe(0);
    expect(res.total).toBe(31500);
  });

  it('aplica cupón fijo y no excede el subtotal', () => {
    const items = [{ id: 1, qty: 1 }];
    const coupon = { type: 'fijo', amount: 5000 };
    const res = calculateTotals(products, items, coupon);
    // subtotal 1000, descuento min(5000,1000)=1000, envio 3000, total = 3000
    expect(res.subtotal).toBe(1000);
    expect(res.descuento).toBe(1000);
    expect(res.total).toBe(3000);
  });
});