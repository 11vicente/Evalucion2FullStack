// src/utils/auth.js
export function saveSession({ token, role, username }) {
  localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role);
  if (username) localStorage.setItem("username", username);
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

export function isLogged() {
  return !!localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}
