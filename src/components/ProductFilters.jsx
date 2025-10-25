import React from 'react';

export default function ProductFilters({ categories = [], selectedCategory, onSelectCategory, searchTerm, onSearch }) {
  return (
    <div className="mb-4">
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <button className={`btn btn-sm ${selectedCategory === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onSelectCategory('todos')}>Todos</button>
        {categories.map(cat => (
          <button key={cat} className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onSelectCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="input-group">
        <input type="text" className="form-control" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={() => onSearch('')}>Limpiar</button>
      </div>
    </div>
  );
}