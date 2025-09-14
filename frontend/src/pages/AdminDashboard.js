import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlane,
  FaClipboardList,
  FaRocket,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/trips";
const BOOKING_API_URL = "http://localhost:5000/api/bookings";
const ADMIN_TOKEN = localStorage.getItem("token");

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBookings: 0,
    upcomingDepartures: 0,
  });
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    totalSeats: "",
    type: "Flight",
  });
  const [editTrip, setEditTrip] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      setTrips(response.data);

      const now = new Date();
      const upcoming = response.data.filter((trip) => new Date(trip.date) > now).length;

      setStats((prev) => ({
        ...prev,
        totalTrips: response.data.length,
        upcomingDepartures: upcoming,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(BOOKING_API_URL, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      setBookings(response.data);
      setStats((prev) => ({ ...prev, totalBookings: response.data.length }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchBookings();
  }, []);

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newTrip, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setTrips([...trips, response.data]);
      setShowAddTripModal(false);
      setNewTrip({
        from: "",
        to: "",
        date: "",
        time: "",
        price: "",
        totalSeats: "",
        type: "Flight",
      });
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Failed to add trip");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await axios.delete(`${API_URL}/${tripId}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip");
    }
  };

  const openEditModal = (trip) => {
    setEditTrip({ ...trip });
    setShowEditTripModal(true);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${editTrip._id}`, editTrip, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      setTrips(trips.map((t) => (t._id === editTrip._id ? response.data : t)));
      setShowEditTripModal(false);
      setEditTrip(null);
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("Failed to update trip");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${BOOKING_API_URL}/${bookingId}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-content">
          <h2>Admin Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-content">
                <div className="stat-icon">
                  <FaPlane />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalTrips}</div>
                  <div className="stat-label">Total Trips</div>
                </div>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-content">
                <div className="stat-icon">
                  <FaClipboardList />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalBookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-content">
                <div className="stat-icon">
                  <FaRocket />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{stats.upcomingDepartures}</div>
                  <div className="stat-label">Upcoming Departures</div>
                </div>
              </div>
            </div>
          </div>

          <div className="trips-section">
            <div className="section-header">
              <h3>Trip Management</h3>
              <div className="section-buttons">
                <button className="section-btn primary">All Trips</button>
                <button className="section-btn secondary" onClick={() => setShowAddTripModal(true)}>
                  + Add New Trip
                </button>
              </div>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Route</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Total Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, index) => (
                    <tr key={trip._id}>
                      <td>T{String(index + 1).padStart(3, "0")}</td>
                      <td>
                        {trip.from} to {trip.to}
                      </td>
                      <td>
                        {formatDate(trip.date)} {trip.time}
                      </td>
                      <td>₹{trip.price}</td>
                      <td>{trip.totalSeats}</td>
                      <td>
                        <button className="action-btn edit" onClick={() => openEditModal(trip)}>
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteTrip(trip._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bookings-section">
            <div className="section-header">
              <h3>Booking Management</h3>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Trip Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>QR Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.user?.name || "N/A"}</td>
                      <td>
                        {booking.trip?.from} to {booking.trip?.to}
                      </td>
                      <td>{formatDate(booking.trip?.date)}</td>
                      <td>{booking.seats.join(", ")}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
                        <span className="qr-verified">
                          <FaCheckCircle />
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddTripModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Trip Details</h3>
              <button className="close-btn" onClick={() => setShowAddTripModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddTrip} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="text"
                    placeholder="Departure Location"
                    value={newTrip.from}
                    onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input
                    type="text"
                    placeholder="Arrival Destination"
                    value={newTrip.to}
                    onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newTrip.date}
                    onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:30 AM"
                    value={newTrip.time}
                    onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newTrip.price}
                    onChange={(e) => setNewTrip({ ...newTrip, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Seats</label>
                  <input
                    type="number"
                    placeholder="Total no of seats"
                    value={newTrip.totalSeats}
                    onChange={(e) => setNewTrip({ ...newTrip, totalSeats: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="text-center">
                <button type="submit" className="submit-btn">
                  Add Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditTripModal && editTrip && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Trip</h3>
              <button className="close-btn" onClick={() => setShowEditTripModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateTrip} className="modal-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="From"
                  value={editTrip.from}
                  onChange={(e) => setEditTrip({ ...editTrip, from: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="To"
                  value={editTrip.to}
                  onChange={(e) => setEditTrip({ ...editTrip, to: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="date"
                  value={editTrip.date}
                  onChange={(e) => setEditTrip({ ...editTrip, date: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="e.g. 09:30 AM"
                  value={editTrip.time}
                  onChange={(e) => setEditTrip({ ...editTrip, time: e.target.value })}
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Price"
                value={editTrip.price}
                onChange={(e) => setEditTrip({ ...editTrip, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Total Seats"
                value={editTrip.totalSeats}
                onChange={(e) => setEditTrip({ ...editTrip, totalSeats: e.target.value })}
                required
              />
              <button type="submit" className="submit-btn">
                Update Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
