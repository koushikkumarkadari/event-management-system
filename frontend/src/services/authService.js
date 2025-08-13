// src/services/authService.js
import { getUsers } from './dataService';

export function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return null;

  const token = `dummy-token-${user.id}`;
  localStorage.setItem('token', token);
  localStorage.setItem('role', user.role);
  localStorage.setItem('currentUserId', String(user.id));
  localStorage.setItem('currentUserEmail', user.email);
  return { token, role: user.role, user };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('currentUserEmail');
}

export function getCurrentUser() {
  const id = localStorage.getItem('currentUserId');
  const email = localStorage.getItem('currentUserEmail');
  const role = localStorage.getItem('role');
  if (!id || !role) return null;
  return { id: Number(id), email, role };
}
