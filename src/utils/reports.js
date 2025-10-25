
// Funciones para generar reportes/admin metrics a partir de users y products

// helpers
function sum(arr, fn) {
  return (arr || []).reduce((s, x) => s + (fn ? fn(x) : x), 0);
}

export function monthKey(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// Genera el reporte principal
export function generateAdminReport(users = [], products = []) {
  // recoger todas las órdenes
  const orders = [];
  users.forEach(u => {
    (u.orders || []).forEach(o => {
      orders.push({
        ...o,
        userId: u.id,
        userName: u.nombre,
        userEmail: u.email
      });
    });
  });

  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = sum(orders, o => Number(o.total || 0));

  // órdenes por estado
  const ordersByStatus = orders.reduce((acc, o) => {
    const st = o.status || 'pendiente';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  // órdenes por mes (últimos 6 meses)
  const ordersByMonthMap = orders.reduce((acc, o) => {
    const k = monthKey(o.date || new Date().toISOString());
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  // ordenar keys descendente y tomar últimos 6
  const months = Object.keys(ordersByMonthMap).sort().slice(-6);
  const ordersByMonth = months.map(m => ({ month: m, count: ordersByMonthMap[m] }));

  // top productos (por qty) desde items de órdenes
  const productMap = {};
  orders.forEach(o => {
    (o.items || []).forEach(it => {
      const id = it.productId != null ? it.productId : it.id;
      const name = it.name || (products.find(p => p.id === id) || {}).title || `#${id}`;
      const qty = Number(it.qty || 0);
      const price = Number(it.price || 0);
      if (!productMap[id]) productMap[id] = { id, name, qty: 0, revenue: 0 };
      productMap[id].qty += qty;
      productMap[id].revenue += qty * price;
    });
  });
  const topProducts = Object.values(productMap).sort((a,b) => b.qty - a.qty).slice(0,10);

  return {
    totalUsers,
    totalOrders,
    totalSales,
    ordersByStatus,
    ordersByMonth,
    topProducts,
    orders, // raw orders por si se necesita
  };
}