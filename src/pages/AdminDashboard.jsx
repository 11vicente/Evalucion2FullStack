import React, { useEffect, useMemo, useState } from 'react';
import { readAll as readProducts } from '../data/productsCRUD';
import { readAll as readUsers, exportAllOrders } from '../data/usersCRUD';
import { generateAdminReport } from '../utils/reports';
import { exportToCsv } from '../utils/exportCsv';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    function load() {
      setProducts(readProducts());
      setUsers(readUsers());
    }
    load();
    window.addEventListener('users-updated', load);
    window.addEventListener('products-updated', load);
    return () => {
      window.removeEventListener('users-updated', load);
      window.removeEventListener('products-updated', load);
    };
  }, []);

  useEffect(() => {
    setReport(generateAdminReport(users, products));
  }, [users, products]);

  const handleExportSummaryCsv = () => {
    if (!report) return;
    const rows = [
      { metric: 'Total usuarios', value: report.totalUsers },
      { metric: 'Total órdenes', value: report.totalOrders },
      { metric: 'Ventas totales', value: report.totalSales },
    ];
    // agregar órdenes por estado al CSV
    Object.keys(report.ordersByStatus || {}).forEach(k => {
      rows.push({ metric: `Órdenes - ${k}`, value: report.ordersByStatus[k] });
    });
    exportToCsv('admin_report_summary.csv', rows);
  };

  const handleExportAllOrders = () => {
    const rows = exportAllOrders();
    exportToCsv('orders_all_users.csv', rows);
  };

  if (!report) return <div>Cargando reporte...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Panel Administrativo</h1>
          <p className="text-muted">Reporte y métricas rápidas</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleExportSummaryCsv}>Exportar resumen (CSV)</button>
          <button className="btn btn-outline-success" onClick={handleExportAllOrders}>Exportar todas las órdenes (CSV)</button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-md-3">
          <div className="card p-3 h-100">
            <h6 className="text-muted">Usuarios</h6>
            <h3>{report.totalUsers}</h3>
            <small className="text-muted">Total de cuentas</small>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card p-3 h-100">
            <h6 className="text-muted">Órdenes</h6>
            <h3>{report.totalOrders}</h3>
            <small className="text-muted">Órdenes registradas</small>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card p-3 h-100">
            <h6 className="text-muted">Ventas</h6>
            <h3>${Number(report.totalSales || 0).toLocaleString()}</h3>
            <small className="text-muted">Ventas totales</small>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card p-3 h-100">
            <h6 className="text-muted">Órdenes pendientes</h6>
            <h3>{report.ordersByStatus['pendiente'] || 0}</h3>
            <small className="text-muted">Por procesar</small>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h5>Órdenes por estado</h5>
            <ul className="list-group list-group-flush">
              {Object.keys(report.ordersByStatus).length === 0 && <li className="list-group-item text-muted">Sin datos</li>}
              {Object.entries(report.ordersByStatus).map(([status, count]) => (
                <li key={status} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="text-capitalize">{status}</div>
                  <span className="badge bg-primary rounded-pill">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-3">
            <h5>Órdenes (últimos meses)</h5>
            {report.ordersByMonth.length === 0 ? <p className="text-muted">Sin datos</p> : (
              <ul className="list-group list-group-flush">
                {report.ordersByMonth.map(m => (
                  <li key={m.month} className="list-group-item d-flex justify-content-between">
                    <div>{m.month}</div>
                    <div>{m.count} órdenes</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h5>Top productos vendidos</h5>
            {report.topProducts.length === 0 ? <p className="text-muted">Sin datos</p> : (
              <table className="table table-sm">
                <thead>
                  <tr><th>Producto</th><th className="text-center">Cantidad</th><th className="text-end">Revenue</th></tr>
                </thead>
                <tbody>
                  {report.topProducts.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="text-center">{p.qty}</td>
                      <td className="text-end">${Number(p.revenue || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card p-3">
            <h5>Últimas órdenes</h5>
            {report.orders.slice(0,8).length === 0 ? <p className="text-muted">Sin órdenes</p> : (
              <ul className="list-group">
                {report.orders.slice(0,8).map(o => (
                  <li key={o.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">Orden #{o.id}</div>
                      <div className="small text-muted">{new Date(o.date).toLocaleString()} — {o.userName}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">${Number(o.total || 0).toLocaleString()}</div>
                      <div className="small text-muted">{o.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}