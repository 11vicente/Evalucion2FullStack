// src/data/usersCRUD.js
// CRUD y autenticación de usuarios (localStorage)
// Ahora incluye seed inicial con órdenes (boletas) de prueba.
// Solo se escribe en localStorage si la clave ms_users_v1 NO existe.

const STORAGE_KEY = 'ms_users_v1';

// Datos iniciales (usuarios + órdenes de ejemplo)
let users = [
  {
    id: 1,
    nombre: 'Administrador',
    email: 'admin@mil.com',
    password: 'admin123',
    edad: 30,
    telefono: '',
    region: 'RMS',
    comuna: 'Santiago',
    isAdmin: true,
    orders: [
      {
        id: 100001,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // hace 2 días
        status: 'completado',
        items: [
          { productId: 15, name: 'Torta Especial de Cumpleaños', qty: 1, price: 45000 }
        ],
        total: 45000,
        note: 'Entrega programada fin de semana',
        attachments: [{ url: '/img/receipt-sample.png', name: 'receipt-sample.png' }]
      },
      {
        id: 100002,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        status: 'enviado',
        items: [
          { productId: 5, name: 'Mousse de Chocolate', qty: 2, price: 4500 },
          { productId: 11, name: 'Brownie Sin Gluten', qty: 1, price: 3200 }
        ],
        total: 4500 * 2 + 3200,
        note: 'Pedido para merienda',
        attachments: []
      }
    ]
  },
  {
    id: 2,
    nombre: 'Cliente Demo',
    email: 'cliente@mil.com',
    password: 'cliente123',
    edad: 28,
    telefono: '',
    region: 'Araucania',
    comuna: 'Temuco',
    isAdmin: false,
    orders: [
      {
        id: 200001,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        status: 'pendiente',
        items: [
          { productId: 2, name: 'Torta Cuadrada de Frutas', qty: 1, price: 11500 },
          { productId: 6, name: 'Tiramisú Clásico', qty: 1, price: 5500 }
        ],
        total: 11500 + 5500,
        note: 'Pedido para cumpleaños',
        attachments: []
      },
      {
        id: 200002,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        status: 'completado',
        items: [
          { productId: 5, name: 'Mousse de Chocolate', qty: 1, price: 4500 },
          { productId: 11, name: 'Brownie Sin Gluten', qty: 2, price: 3200 }
        ],
        total: 4500 + 3200 * 2,
        note: 'Compra familiar',
        attachments: [{ url: '/img/receipt-sample.png', name: 'receipt-sample.png' }]
      },
      {
        id: 200003,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        status: 'cancelado',
        items: [
          { productId: 3, name: 'Torta Circular de Vainilla', qty: 1, price: 11000 }
        ],
        total: 11000,
        note: 'Cancelada por cliente',
        attachments: []
      }
    ]
  }
];

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      users = JSON.parse(raw);
    } catch (e) {
      console.warn('usersCRUD: error parseando storage', e);
      save(); // sobrescribe con defaults por seguridad
    }
  } else {
    // Si no existe la clave, sembramos los datos iniciales (users definido arriba)
    save();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

load();

function nextId() {
  return users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
}

/* ---------------------------
   Exported CRUD / Auth APIs
   ---------------------------*/

export function readAll() {
  return JSON.parse(JSON.stringify(users));
}

export function readById(id) {
  return JSON.parse(JSON.stringify(users.find(u => u.id === Number(id))));
}

export function create(user) {
  const exists = users.some(u => u.email.toLowerCase() === (user.email || '').toLowerCase());
  if (exists) throw new Error('El correo ya está registrado');
  const u = {
    id: nextId(),
    nombre: user.nombre || '',
    email: user.email,
    password: user.password || '',
    edad: user.edad || null,
    telefono: user.telefono || '',
    region: user.region || '',
    comuna: user.comuna || '',
    isAdmin: !!user.isAdmin,
    orders: user.orders || []
  };
  users.push(u);
  save();
  return readById(u.id);
}

export function update(id, updates) {
  const idx = users.findIndex(u => u.id === Number(id));
  if (idx === -1) throw new Error('Usuario no encontrado');
  if (updates.email && updates.email !== users[idx].email) {
    if (users.some(u => u.email.toLowerCase() === (updates.email || '').toLowerCase() && u.id !== Number(id))) {
      throw new Error('El correo ya está en uso por otro usuario');
    }
  }
  users[idx] = { ...users[idx], ...updates };
  save();
  return readById(id);
}

export function remove(id) {
  const idx = users.findIndex(u => u.id === Number(id));
  if (idx === -1) throw new Error('Usuario no encontrado');
  const removed = users.splice(idx, 1)[0];
  save();
  return removed;
}

// Authentication
export function authenticate(email, password) {
  const u = users.find(x => x.email.toLowerCase() === (email || '').toLowerCase() && x.password === password);
  return u ? readById(u.id) : null;
}

/* ----------------------------
   Orders API (per-user orders)
   ----------------------------*/

// Agrega una orden al usuario y retorna la orden creada
export function addOrder(userId, order) {
  const idx = users.findIndex(u => u.id === Number(userId));
  if (idx === -1) throw new Error('Usuario no encontrado');
  users[idx].orders = users[idx].orders || [];
  const newOrder = {
    id: Date.now(),
    date: new Date().toISOString(),
    status: 'pendiente',
    attachments: [],
    ...order
  };
  users[idx].orders.push(newOrder);
  save();
  return JSON.parse(JSON.stringify(newOrder));
}

// Obtener órdenes de un usuario
export function getOrders(userId) {
  const u = users.find(u => u.id === Number(userId));
  return u ? JSON.parse(JSON.stringify(u.orders || [])) : [];
}

// Actualizar una orden específica
export function updateOrder(userId, orderId, updates) {
  const uIdx = users.findIndex(u => u.id === Number(userId));
  if (uIdx === -1) throw new Error('Usuario no encontrado');
  const orders = users[uIdx].orders || [];
  const oIdx = orders.findIndex(o => o.id === Number(orderId));
  if (oIdx === -1) throw new Error('Orden no encontrada');
  orders[oIdx] = { ...orders[oIdx], ...updates };
  users[uIdx].orders = orders;
  save();
  return JSON.parse(JSON.stringify(orders[oIdx]));
}

// Eliminar una orden
export function removeOrder(userId, orderId) {
  const uIdx = users.findIndex(u => u.id === Number(userId));
  if (uIdx === -1) throw new Error('Usuario no encontrado');
  const orders = users[uIdx].orders || [];
  const oIdx = orders.findIndex(o => o.id === Number(orderId));
  if (oIdx === -1) throw new Error('Orden no encontrada');
  const removed = orders.splice(oIdx, 1)[0];
  users[uIdx].orders = orders;
  save();
  return JSON.parse(JSON.stringify(removed));
}

// Añadir adjunto (objeto { url, name }) a una orden
export function addAttachmentToOrder(userId, orderId, attachment) {
  const uIdx = users.findIndex(u => u.id === Number(userId));
  if (uIdx === -1) throw new Error('Usuario no encontrado');
  const oIdx = (users[uIdx].orders || []).findIndex(o => o.id === Number(orderId));
  if (oIdx === -1) throw new Error('Orden no encontrada');
  users[uIdx].orders[oIdx].attachments = users[uIdx].orders[oIdx].attachments || [];
  users[uIdx].orders[oIdx].attachments.push(attachment);
  save();
  return JSON.parse(JSON.stringify(users[uIdx].orders[oIdx].attachments));
}

// Export: devuelve todas las órdenes (planas) con datos del usuario para CSV/export
export function exportAllOrders() {
  const rows = [];
  users.forEach(u => {
    (u.orders || []).forEach(o => {
      rows.push({
        userId: u.id,
        userName: u.nombre,
        userEmail: u.email,
        orderId: o.id,
        date: o.date,
        status: o.status || '',
        total: o.total || 0,
        items: JSON.stringify(o.items || [])
      });
    });
  });
  return rows;
}