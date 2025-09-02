import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../../services/authService";
import { getBookingsByUser, getEvents } from "../../../services/dataService";
import { formatDateTime } from "../../../utils/date";
import "./Bookinghistory.css";
import UserSidebar from "../../../components/UserSidebar/UserSidebar";


export default function BookingHistory() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const me = getCurrentUser();
    if (!me) return;
    const bookings = getBookingsByUser(me.id);
    const events = getEvents();
    const today = new Date();

    const attended = bookings
      .filter((b) => {
        const event = events.find((e) => Number(e.id) === Number(b.eventId));
        return b.status === "CONFIRMED" && event && new Date(event.date) < today;
      })
      .map((b) => {
        const event = events.find((e) => Number(e.id) === Number(b.eventId));
        return {
          id: b.id,
          eventTitle: event?.title || "—",
          date: event ? formatDateTime(event.date) : "—",
          status: b.status,
        };
      });

    setRows(attended);
  }, []);

  const filteredRows = rows.filter(r =>
    r.eventTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout" >
      <div className="sidebar">
        {/* Sidebar only visible on desktop via CSS */}
        <UserSidebar />
      </div>
      <div className="booking-history-container">
        <h2 className="booking-history-title">Booking History</h2>
        <input
          type="text"
          placeholder="Search by event title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16, width: '100%', padding: 8 }}
        />
        <table className="booking-history-table">
          <thead>
            <tr className="booking-history-header-row">
              <th className="booking-history-header">Booking ID</th>
              <th className="booking-history-header">Event</th>
              <th className="booking-history-header">Date</th>
              <th className="booking-history-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No past attended events.
                </td>
              </tr>
            )}
            {filteredRows.map((r) => (
              <tr key={r.id} className="booking-history-row">
                <td className="booking-history-cell">{r.id}</td>
                <td className="booking-history-cell">{r.eventTitle}</td>
                <td className="booking-history-cell">{r.date}</td>
                <td
                  className={`booking-history-cell booking-history-status ${
                    r.status === "CONFIRMED"
                      ? "status-confirmed"
                      : r.status === "CANCELLED"
                      ? "status-cancelled"
                      : "status-pending"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}