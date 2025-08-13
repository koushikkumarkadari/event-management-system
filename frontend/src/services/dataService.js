// src/services/dataService.js
import usersSeed from '../data/users.json';
import eventsSeed from '../data/events.json';
import bookingsSeed from '../data/bookings.json';

const KEYS = {
  USERS: 'users',
  EVENTS: 'events',
  BOOKINGS: 'bookings',
  SEEDED: 'seeded',
};

export function initData() {
  if (localStorage.getItem(KEYS.SEEDED)) return;

  // Ensure IDs are numbers and unique
  const users = usersSeed.map(u => ({ ...u, id: Number(u.id) }));
  const events = eventsSeed.map(e => ({ ...e, id: Number(e.id) }));
  const bookings = bookingsSeed.map(b => ({ ...b, id: Number(b.id) }));

  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  localStorage.setItem(KEYS.SEEDED, 'true');
}

function read(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextId(items) {
  return items.length ? Math.max(...items.map(i => Number(i.id))) + 1 : 1;
}

// Users
export function getUsers() {
  return read(KEYS.USERS);
}

export function updateUserRole(userId, role) {
  const users = getUsers();
  const idx = users.findIndex(u => Number(u.id) === Number(userId));
  if (idx >= 0) {
    users[idx].role = role;
    write(KEYS.USERS, users);
  }
  return users[idx] || null;
}

// Events
export function getEvents() {
  return read(KEYS.EVENTS);
}

export function addEvent(event) {
  const events = getEvents();
  const newEvent = { ...event, id: nextId(events) };
  events.push(newEvent);
  write(KEYS.EVENTS, events);
  return newEvent;
}

export function deleteEvent(eventId) {
  const events = getEvents().filter(e => Number(e.id) !== Number(eventId));
  write(KEYS.EVENTS, events);
  // Also remove related bookings
  const bookings = getBookings().filter(b => Number(b.eventId) !== Number(eventId));
  write(KEYS.BOOKINGS, bookings);
}

// Bookings
export function getBookings() {
  return read(KEYS.BOOKINGS);
}

export function getBookingsByUser(userId) {
  return getBookings().filter(b => Number(b.userId) === Number(userId));
}

export function addBooking(booking) {
  const bookings = getBookings();
  const exists = bookings.some(
    b => Number(b.userId) === Number(booking.userId) && Number(b.eventId) === Number(booking.eventId),
  );
  if (exists) return null;
  const newBooking = { ...booking, id: nextId(bookings), status: booking.status || 'CONFIRMED' };
  bookings.push(newBooking);
  write(KEYS.BOOKINGS, bookings);
  return newBooking;
}

export function deleteBooking(bookingId) {
  const bookings = getBookings().filter(b => Number(b.id) !== Number(bookingId));
  write(KEYS.BOOKINGS, bookings);
}

// Helpers to join
export function getJoinedBookings() {
  const users = getUsers();
  const events = getEvents();
  return getBookings().map(b => ({
    ...b,
    user: users.find(u => Number(u.id) === Number(b.userId)) || null,
    event: events.find(e => Number(e.id) === Number(b.eventId)) || null,
  }));
}
