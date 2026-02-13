// src/services/authService.ts

const API_URL = 'https://nails-maribel-backend.onrender.com';

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  // Guardar token y usuario
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}


export async function loginClient(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login-client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function registerClient(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
