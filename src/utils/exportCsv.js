// src/utils/exportCsv.js
// Util simple para exportar un array de objetos a CSV y forzar descarga
export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) {
    alert('No hay datos para exportar.');
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(','), 
    ...rows.map(r => keys.map(k => {
      const val = r[k] === null || r[k] === undefined ? '' : String(r[k]).replace(/"/g, '""');
      return `"${val}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}