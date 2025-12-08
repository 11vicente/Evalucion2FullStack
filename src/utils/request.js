// src/utils/request.js
const API = process.env.REACT_APP_API_URL ;

async function request(path, options = {}) {
  const token = localStorage.getItem('jwtToken');
  const headers = options.headers || {};

  // No forzar Content-Type si es FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    const message = text || res.statusText || `Error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();

  return res.text();
}

/* -------------------------
   Helpers normales del CRUD
   ------------------------- */

export async function get(path) {
  return request(path, { method: "GET" });
}

export async function post(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function put(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export async function delReq(path) {
  return request(path, {
    method: "DELETE"
  });
}

// export default y nombrado
export { request };
export default request;
