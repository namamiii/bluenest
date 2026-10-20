
import { useEffect, useState } from "react";
import { getBookings } from "../components/api.js";
import "./BookingRequests.css";

function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const data = await getBookings();

        const bookingList = Array.isArray(data)
          ? data
          : data.data || data.results || data.bookings || [];

        setBookings(bookingList);
      } catch (err) {
        console.error("Booking requests error:", err);
        setError(err.message || "Unable to load booking requests.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="booking-page">
        <h1>Booking Requests</h1>
        <p>Loading booking requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <h1>Booking Requests</h1>
        <p className="booking-error">{error}</p>

        <button
          className="booking-retry-btn"
          onClick={() => window.location.reload()}
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
          <p>View booking requests received for your properties.</p>
        </div>

        <span className="booking-count">
          {bookings.length}{" "}
          {bookings.length === 1 ? "Request" : "Requests"}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="booking-empty-state">
          <div className="booking-empty-icon">⌂</div>
          <h2>No booking requests yet</h2>
          <p>
            When booking requests are available from the backend,
            they will appear here.
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => (
            <div
              className="booking-card"
              key={booking.id ?? booking.booking_id ?? index}
            >
              <div className="booking-card-top">
                <div>
                  <h2>
                    {booking.property_title ||
                      booking.property?.title ||
                      booking.property_name ||
                      `Booking #${
                        booking.id ?? booking.booking_id ?? index + 1
                      }`}
                  </h2>

                  <p className="booking-reference">
                    Booking ID: {booking.id ?? booking.booking_id ?? "N/A"}
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
                    ? new Date(booking.created_at).toLocaleDateString("en-IN")
                    : booking.booking_date
                    ? new Date(booking.booking_date).toLocaleDateString("en-IN")
                    : "Not provided"}
                </p>

                {booking.message && (
                  <p>
                    <strong>Message:</strong> {booking.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingRequests;
