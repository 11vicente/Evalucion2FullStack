import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';

import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute';
import AdminOrders from './pages/AdminOrders';
import Tracking from './pages/Tracking';

export default function App() {
  return (
    <>
      <Header />
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:userId/:orderId" element={<Tracking />} />
          {/* admin: rutas anidadas protegidas */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />c
            {/* puedes añadir más rutas: <Route path="orders" element={<AdminOrders />} /> */}
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}