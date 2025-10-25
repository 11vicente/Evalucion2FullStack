import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { readAll } from '../data/productsCRUD';
import useCart from '../hooks/useCart';

export default function ProductList() {
  const { add } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('todos');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    setProducts(readAll());
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category || 'sin-categoria')));
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category && category !== 'todos') list = list.filter(p => (p.category || '') === category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => (p.title || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    return list;
  }, [products, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function handleAdd(id) {
    add(id, 1);
    // puedes mostrar una notificación o toast aquí
  }

  return (
    <div>
      <h1 className="section-title text-center mb-4">Nuestros Productos</h1>

      <ProductFilters
        categories={categories}
        selectedCategory={category}
        onSelectCategory={(c) => { setCategory(c); setPage(1); }}
        searchTerm={search}
        onSearch={(s) => { setSearch(s); setPage(1); }}
      />

      <div className="row g-4">
        {paged.length === 0 ? (
          <div className="col-12"><div className="alert alert-info">No se encontraron productos.</div></div>
        ) : paged.map(p => (
          <div className="col-md-4" key={p.id}>
            <ProductCard product={p} onAdd={handleAdd} />
          </div>
        ))}
      </div>

      <nav className="mt-4" aria-label="Paginación de productos">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button></li>
          <li className="page-item disabled"><span className="page-link">Página {page} de {totalPages}</span></li>
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Siguiente</button></li>
        </ul>
      </nav>
    </div>
  );
}