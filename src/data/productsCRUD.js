// src/data/productsCRUD.js
// Módulo de persistencia + CRUD para productos (localStorage)

const STORAGE_KEY = 'mi_tienda_products_v1';

let products = [
  { id: 1, title: "Torta Cuadrada de Chocolate", price: 12000, img: "/img/pastel-chocolate-decadente-sinfonia-marron_632498-24549.jpg", description: "Delicia de chocolate", category: "tortas", stock: 10, offer: false },
  { id: 2, title: "Torta Cuadrada de Frutas", price: 11500, img: "/img/cuadrad de frutas.png", description: "Frutas frescas", category: "tortas", stock: 6, offer: false },
  { id: 3, title: "Mousse de Chocolate", price: 4500, img: "/img/mouseChoco.png", description: "Mousse ligero", category: "postres", stock: 20, offer: true },
  { id: 4, title: "Torta Circular de Manjar", price: 12500, img: "/img/tortaManjar.png", description: "Tradicional chilena con manjar y nueces.", category: "Tortas Circulares", stock: 6, offer: false },

  { id: 5, title: "Mousse de Chocolate", price: 4500, img: "/img/mouseChoco.png", description: "Postre cremoso hecho con chocolate de alta calidad.", category: "Postres Individuales", stock: 20, offer: true },
  { id: 6, title: "Tiramisú Clásico", price: 5500, img: "/img/tiramisu.png", description: "Capas de café, mascarpone y cacao.", category: "Postres Individuales", stock: 15, offer: false },

  { id: 7, title: "Torta Sin Azúcar de Naranja", price: 10500, img: "/img/TORTAnaranaja.png", description: "Ligera, deliciosa y endulzada naturalmente.", category: "Productos Sin Azúcar", stock: 7, offer: false },
  { id: 8, title: "Cheesecake Sin Azúcar", price: 8500, img: "/img/cheeseCakesSinAz.png", description: "Suave y cremoso, ideal para disfrutar sin culpa.", category: "Productos Sin Azúcar", stock: 9, offer: false },

  { id: 9, title: "Empanada de Manzana", price: 1800, img: "/img/emapanaanazanam.png", description: "Rellena de manzanas especiadas, perfecta para la merienda.", category: "Pastelería Tradicional", stock: 30, offer: false },
  { id: 10, title: "Tarta de Santiago", price: 7000, img: "/img/santiaago.png", description: "Tarta española con almendras, azúcar y huevos.", category: "Pastelería Tradicional", stock: 5, offer: false },

  { id: 11, title: "Brownie Sin Gluten", price: 3200, img: "/img/brownie (1).png", description: "Denso y delicioso, ideal para celíacos.", category: "Productos sin gluten", stock: 14, offer: false },
  { id: 12, title: "Pan Sin Gluten", price: 2500, img: "/img/singluten.png", description: "Suave y esponjoso, ideal para acompañar comidas.", category: "Productos sin gluten", stock: 10, offer: false },

  { id: 13, title: "Torta Vegana de Chocolate", price: 13000, img: "/img/tortaVChocolate.png", description: "Húmeda y deliciosa, sin productos animales.", category: "Productos Vegana", stock: 6, offer: false },
  { id: 14, title: "Galletas Veganas de Avena", price: 1800, img: "/img/galletasAvena.png", description: "Crujientes, sabrosas y saludables.", category: "Productos Vegana", stock: 25, offer: false },

  { id: 15, title: "Torta Especial de Cumpleaños", price: 45000, img: "/img/cumple.png", description: "Personalizable con decoraciones y mensajes únicos.", category: "Tortas Especiales", stock: 3, offer: false },
  { id: 16, title: "Torta Especial de Boda", price: 90000, img: "/img/boda.png", description: "Elegante y deliciosa, pensada para celebraciones únicas.", category: "Tortas Especiales", stock: 2, offer: false }
];

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      products = JSON.parse(raw);
    } catch (e) {
      console.warn('productsCRUD: error parseando storage', e);
    }
  } else {
    save();
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
load();

function nextId() {
  const max = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
  return max + 1;
}

export function readAll() {
  return JSON.parse(JSON.stringify(products));
}

export function readById(id) {
  return JSON.parse(JSON.stringify(products.find(p => p.id === Number(id))));
}

export function create(product) {
  const p = { id: nextId(), ...product };
  products.push(p);
  save();
  return readById(p.id);
}

export function update(id, updates) {
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) throw new Error('Producto no encontrado');
  products[idx] = { ...products[idx], ...updates };
  save();
  return readById(id);
}

export function remove(id) {
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) throw new Error('Producto no encontrado');
  const removed = products.splice(idx, 1)[0];
  save();
  return removed;
}

export function filterByCategory(category) {
  return readAll().filter(p => p.category === category);
}
export function filterOffers() {
  return readAll().filter(p => p.offer);
}
export function search(term) {
  const t = (term || '').toLowerCase();
  return readAll().filter(p => p.title.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
}