// src/services/authService.js
import { getUsers } from './dataService';
import usersSeed from '../data/users.json';
import eventsSeed from '../data/events.json';
import bookingsSeed from '../data/bookings.json';

const KEYS = {
  USERS: 'users',
  EVENTS: 'events',
  BOOKINGS: 'bookings',
  SEEDED: 'seeded',
};

function seedLocalStorage() {
  const users = usersSeed.map(u => ({ ...u, id: Number(u.id) }));
  const events = eventsSeed.map(e => ({ ...e, id: Number(e.id) }));
  const bookings = bookingsSeed.map(b => ({ ...b, id: Number(b.id) }));

  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  localStorage.setItem(KEYS.SEEDED, 'true');
}

export function login(email, password) {
  // Always seed data on login
  seedLocalStorage();

  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
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
  localStorage.clear();
}

export function getCurrentUser() {
  const id = localStorage.getItem('currentUserId');
  const email = localStorage.getItem('currentUserEmail');
  const role = localStorage.getItem('role');
  if (!id || !role) return null;
  return { id: Number(id), email, role };
}
