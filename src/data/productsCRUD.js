// src/data/productsCRUD.js
import request from '../utils/request';

export async function readAll() {
  return await request('/api/products', 'GET');
}

export async function readById(id) {
  return await request(`/api/products/${id}`, 'GET');
}

export async function createProduct(product) {
  return await request('/api/products', 'POST', product);
}

export async function updateProduct(id, product) {
  return await request(`/api/products/${id}`, 'PUT', product);
}

export async function deleteProduct(id) {
  return await request(`/api/products/${id}`, 'DELETE');
}

export default {
  readAll,
  readById,
  createProduct,
  updateProduct,
  deleteProduct
};
