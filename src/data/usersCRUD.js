// src/data/usersCRUD.js
// Capa de acceso a la API de usuarios/órdenes usando tu utils/request

let _requestFn = null;

async function getRequest() {
  if (_requestFn) return _requestFn;
  const mod = await import("../utils/request");

  const fn =
    typeof mod === "function"
      ? mod
      : typeof mod.default === "function"
      ? mod.default
      : typeof mod.request === "function"
      ? mod.request
      : null;

  if (!fn) throw new Error("request() no encontrado en ../utils/request");
  _requestFn = fn;
  return _requestFn;
}

// =========================
//  AUTH
// =========================

export async function login({ email, password }) {
  const request = await getRequest();
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.accessToken) {
    throw new Error("Respuesta inválida del servidor");
  }

  localStorage.setItem("jwtToken", data.accessToken);
  localStorage.setItem("ms_current_user", JSON.stringify(data.user));
  localStorage.setItem("isAdmin", String(!!data.user?.isAdmin));

  return data.user;
}

export async function register(user) {
  const request = await getRequest();
  const payload = {
    nombre: user.nombre,
    email: user.email,
    password: user.password,
  };

  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data?.accessToken) {
    throw new Error("Respuesta inválida del servidor");
  }

  localStorage.setItem("jwtToken", data.accessToken);
  localStorage.setItem("ms_current_user", JSON.stringify(data.user));
  localStorage.setItem("isAdmin", String(!!data.user?.isAdmin));

  return data.user;
}

export function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("ms_current_user");
  localStorage.removeItem("isAdmin");
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("ms_current_user"));
  } catch {
    return null;
  }
}

// =========================
//  USERS (ADMIN)
// =========================

export async function getUsers() {
  const request = await getRequest();
  return request("/api/users", { method: "GET" });
}

export async function getUser(id) {
  const request = await getRequest();
  return request(`/api/users/${id}`, { method: "GET" });
}

export async function createUser(data) {
  const request = await getRequest();
  return request("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id, data) {
  const request = await getRequest();
  return request(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  const request = await getRequest();
  return request(`/api/users/${id}`, { method: "DELETE" });
}

// PUT /api/users/{id}/toggle-admin (debes tener este endpoint en el backend)
export async function toggleAdmin(id) {
  const request = await getRequest();
  return request(`/api/users/${id}/toggle-admin`, { method: "PUT" });
}

// =========================
//  ORDERS
// =========================

export async function addOrder(order) {
  const request = await getRequest();
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function getOrdersByUser(userId) {
  const request = await getRequest();
  return request(`/api/orders/user/${userId}`, { method: "GET" });
}

export async function getOrder(id) {
  const request = await getRequest();
  return request(`/api/orders/${id}`, { method: "GET" });
}

// updateOrder(userId, orderId, updates/status)
export async function updateOrder(userId, orderId, updates) {
  const request = await getRequest();
  const status =
    typeof updates === "string"
      ? updates
      : updates?.status
      ? updates.status
      : updates;

  return request(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(status),
  });
}

// removeOrder(userId, orderId)
export async function removeOrder(userId, orderId) {
  const request = await getRequest();
  return request(`/api/orders/${orderId}`, { method: "DELETE" });
}

// Lo dejamos por compatibilidad aunque no uses adjuntos en el UI
export async function addAttachmentToOrder(orderId, formData) {
  const request = await getRequest();
  return request(`/api/orders/${orderId}/attachments`, {
    method: "POST",
    body: formData,
  });
}

// =========================
//  EXPORT (ADMIN)
// =========================

export async function exportAllOrders() {
  const request = await getRequest();
  try {
    return await request("/api/admin/orders/export", { method: "GET" });
  } catch (e) {
    // Fallback: recorrer usuarios y sus órdenes
    const users = await getUsers();
    const rows = [];

    for (const u of users) {
      const orders = await getOrdersByUser(u.id);
      for (const o of orders || []) {
        rows.push({
          orderId: o.id,
          date: o.date,
          status: o.status,
          total: o.total || 0,
          items: JSON.stringify(o.items || []),
          userId: u.id,
          userName: u.nombre,
          userEmail: u.email,
        });
      }
    }

    return rows;
  }
}

