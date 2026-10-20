
import { useEffect, useState } from "react";
import {
  getBookings,
  decideBooking,
} from "../components/api.js";
import "./BookingRequests.css";
function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  async function loadBookings() {
    try {
      setLoading(true);
      setError("");
      const data = await getBookings();
      console.log("Bookings API response:", data);
      let bookingList = [];
      if (Array.isArray(data)) {
        bookingList = data;
      } else if (Array.isArray(data?.data)) {
        bookingList = data.data;
      } else if (Array.isArray(data?.results)) {
        bookingList = data.results;
      } else if (Array.isArray(data?.bookings)) {
        bookingList = data.bookings;
      } else if (Array.isArray(data?.requests)) {
        bookingList = data.requests;
      } else if (Array.isArray(data?.data?.bookings)) {
        bookingList = data.data.bookings;
      }
      setBookings(bookingList);
    } catch (err) {
      console.error("Booking requests error:", err);
      setError(err.message || "Unable to load booking requests.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadBookings();
  }, []);
  async function handleDecision(booking, status) {
    const bookingId = booking.id ?? booking.booking_id;
    if (bookingId == null) {
      alert("Booking ID is not available.");
      return;
    }
    const action = status === "approved" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} booking #${bookingId}?`
    );
    if (!confirmed) {
      return;
    }
    try {
      setProcessingId(bookingId);
      await decideBooking(bookingId, status);
      alert(`Booking ${action}d successfully.`);
      await loadBookings();
    } catch (err) {
      console.error("Booking decision error:", err);
      alert(err.message || `Unable to ${action} booking.`);
    } finally {
      setProcessingId(null);
    }
  }
  if (loading) {
    return (
      <div className="booking-page">
        <h1>Booking Requests</h1>
        <p>Loading booking requests...</p>
      </div>
    );
  }
  if (error && bookings.length === 0) {
    return (
      <div className="booking-page">
        <h1>Booking Requests</h1>
        <p className="booking-error">{error}</p>
        <button
          type="button"
          className="booking-retry-btn"
          onClick={loadBookings}
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="booking-page">
      <div className="booking-heading">
        <div>
          <p className="eyebrow">PROPERTY MANAGEMENT</p>
          <h1>Booking Requests</h1>
          <p>
            View and manage booking requests received for your properties.
          </p>
        </div>
        <span className="booking-count">
          {bookings.length}{" "}
          {bookings.length === 1 ? "Request" : "Requests"}
        </span>
      </div>
      {error && <p className="booking-error">{error}</p>}
      {bookings.length === 0 ? (
        <div className="booking-empty-state">
          <div className="booking-empty-icon">⌂</div>
          <h2>No booking requests yet</h2>
          <p>
            Booking requests received from the backend will appear here.
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => {
            const bookingId = booking.id ?? booking.booking_id;
            const status = String(
              booking.status || booking.booking_status || ""
            ).toLowerCase();
            const isProcessing = processingId === bookingId;
            const isPending =
              !status ||
              status === "pending" ||
              status === "requested";
            return (
              <div
                className="booking-card"
                key={bookingId ?? index}
              >
                <div className="booking-card-top">
                  <div>
                    <h2>
                      {booking.property_title ||
                        booking.property?.title ||
                        booking.property_name ||
                        `Booking #${bookingId ?? index + 1}`}
                    </h2>
                    <p className="booking-reference">
                      Booking ID: {bookingId ?? "N/A"}
                    </p>
                  </div>
                  <span className="booking-status">
                    {booking.status ||
                      booking.booking_status ||
                      "Status unavailable"}
                  </span>
                </div>
                <div className="booking-details">
                  <p>
                    <strong>Tenant:</strong>{" "}
                    {booking.tenant_name ||
                      booking.tenant?.username ||
                      booking.tenant?.name ||
                      booking.user?.username ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Requested on:</strong>{" "}
                    {booking.created_at
                      ? new Date(
                          booking.created_at
                        ).toLocaleDateString("en-IN")
                      : booking.booking_date
                      ? new Date(
                          booking.booking_date
                        ).toLocaleDateString("en-IN")
                      : "Not provided"}
                  </p>
                  {booking.message && (
                    <p>
                      <strong>Message:</strong> {booking.message}
                    </p>
                  )}
                </div>
                {isPending && (
                  <div className="booking-actions">
                    <button
                      type="button"
                      className="booking-accept-btn"
                      disabled={isProcessing}
                      onClick={() =>
                        handleDecision(booking, "approved")
                      }
                    >
                      {isProcessing ? "Processing..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      className="booking-reject-btn"
                      disabled={isProcessing}
                      onClick={() =>
                        handleDecision(booking, "rejected")
                      }
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default BookingRequests;
