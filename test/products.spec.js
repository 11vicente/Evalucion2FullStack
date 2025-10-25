// test/products.spec.js
import { readAll, create, update, remove } from '../src/data/productsCRUD';

describe('productsCRUD - CRUD básico', () => {
  it('readAll devuelve un array', () => {
    const all = readAll();
    expect(Array.isArray(all)).toBeTrue();
  });

  it('create añade un producto y devuelve el nuevo producto con id', () => {
    const newP = create({ title: 'TEST', price: 1000, img: '/img/test.png', description: 'x', category: 'test', stock: 1, offer: false });
    expect(newP.id).toBeDefined();
    expect(newP.title).toBe('TEST');
  });

  it('update modifica un producto existente', () => {
    const all = readAll();
    const last = all[all.length - 1];
    const updated = update(last.id, { price: 2000 });
    expect(updated.price).toBe(2000);
  });

  it('remove elimina un producto', () => {
    const all = readAll();
    const last = all[all.length - 1];
    const removed = remove(last.id);
    expect(removed.id).toBe(last.id);
  });
});