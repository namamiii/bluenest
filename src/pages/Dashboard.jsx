import { useEffect, useState } from "react";
import "./Dashboard.css";
import MyProperties from "./Myproperties";
import AddProperty from "./Addproperty";
import BookingRequests from "./BookingRequests";
import { getProperties } from "../components/api.js";
function Dashboard({ activePage, onNavigate, onLogout }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const menuItems = [
    "Dashboard",
    "My Properties",
    "Add Property",
    "Booking Requests",
    "Market Insights",
  ];
  const propertyImages = [
    "/images/property1.jpg",
    "/images/property2.jpg",
    "/images/property3.jpg",
  ];
  useEffect(() => {
    async function loadDashboardData() {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Please log in again to load dashboard data.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getProperties(token);
        const propertyList = Array.isArray(data)
          ? data
          : data.results || data.properties || [];
        setProperties(propertyList);
        setError("");
      } catch (err) {
        console.error("Dashboard properties error:", err);
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [activePage]);
  const filteredProperties = properties.filter((property) => {
    const search = searchText.trim().toLowerCase();
    return (
      String(property.title || "").toLowerCase().includes(search) ||
      String(property.city || "").toLowerCase().includes(search) ||
      String(property.locality || "").toLowerCase().includes(search)
    );
  });
  const totalProperties = properties.length;
  const monthlyIncome = properties.reduce((total, property) => {
    return total + Number(property.asking_rent ?? property.rent ?? 0);
  }, 0);
  function formatRent(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img
            src="/images/logo.jpeg"
            alt="BlueNest logo"
            className="sidebar-logo"
          />
          <span>BlueNest</span>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <a
              href="#"
              key={item}
              className={activePage === item ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item);
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="topbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search properties by name or location..."
              className="search-input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <div className="user-info">
            <span>Welcome, User</span>
            <div className="user-avatar">U</div>
            <button
              type="button"
              onClick={onLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </header>
        <section className="dashboard-content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome-section">
                <p className="eyebrow">YOUR OVERVIEW</p>
                <h1>Dashboard Overview</h1>
                <p>
                  Here's what's happening with your properties today.
                </p>
              </div>
              {error && (
                <p className="dashboard-error">{error}</p>
              )}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Total Properties</p>
                    <span className="stat-icon properties-icon">⌂</span>
                  </div>
                  <h2>{loading ? "..." : totalProperties}</h2>
                </div>
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Monthly Listed Rent</p>
                    <span className="stat-icon income-icon">₹</span>
                  </div>
                  <h2>{loading ? "..." : formatRent(monthlyIncome)}</h2>
                </div>
              </div>
              <section className="properties-section">
                <div className="section-heading">
                  <div>
                    <h2>Recent Properties</h2>
                    <p>Keep track of the properties you manage.</p>
                  </div>
                  <button
                    className="view-all-btn"
                    onClick={() => onNavigate("My Properties")}
                  >
                    View all →
                  </button>
                </div>
                {loading ? (
                  <p>Loading properties...</p>
                ) : error ? (
                  <p>Properties could not be loaded.</p>
                ) : filteredProperties.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⌂</div>
                    <h3>
                      {searchText.trim()
                        ? "No matching properties found"
                        : "No properties to show yet"}
                    </h3>
                    <p>
                      {searchText.trim()
                        ? "Try searching with a different property name or location."
                        : "Your properties will appear here once property details are available."}
                    </p>
                    {!searchText.trim() && (
                      <button
                        className="empty-action-btn"
                        onClick={() => onNavigate("Add Property")}
                      >
                        + Add your first property
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="recent-properties-grid">
                    {filteredProperties
                      .slice(0, 3)
                      .map((property, index) => (
                        <div
                          className="recent-property-card"
                          key={property.id ?? index}
                        >
                          <img
                            src={
                              property.image ||
                              propertyImages[index % propertyImages.length]
                            }
                            alt={property.title || "Property"}
                            className="recent-property-image"
                          />
                          <div className="recent-property-details">
                            <h3>
                              {property.title || "Untitled Property"}
                            </h3>
                            <p className="property-location">
                              {property.locality ||
                                property.city ||
                                "Location unavailable"}
                            </p>
                            <p className="property-rent">
                              {formatRent(
                                Number(
                                  property.asking_rent ??
                                    property.rent ??
                                    0
                                )
                              )}
                              <span> / month</span>
                            </p>
                            <div className="property-card-bottom">
                              <span>
                                {property.bhk
                                  ? `${property.bhk} BHK`
                                  : "Residential"}
                              </span>
                              <span className="property-status">
                                {property.is_active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}
          {activePage === "My Properties" && (
            <MyProperties
              onAddProperty={() => onNavigate("Add Property")}
            />
          )}
          {activePage === "Add Property" && <AddProperty />}
          {activePage === "Booking Requests" && <BookingRequests />}
          {activePage === "Market Insights" && (
            <div className="welcome-section">
              <p className="eyebrow">BLUENEST</p>
              <h1>Market Insights</h1>
              <p>
                Get insights to help you make better rental decisions.
              </p>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Rent Prediction</p>
                    <span className="stat-icon income-icon">₹</span>
                  </div>
                  <h2>AI-Powered Estimate</h2>
                  <p>
                    Estimate a suitable rent based on your property details.
                  </p>
                  <button
                    type="button"
                    className="view-all-btn"
                    onClick={() => onNavigate("Add Property")}
                  >
                    Predict Rent →
                  </button>
                </div>
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Listing Analysis</p>
                    <span className="stat-icon properties-icon">✓</span>
                  </div>
                  <h2>Check Your Listing</h2>
                  <p>
                    Use BlueNest's listing analysis feature to check your
                    property listing.
                  </p>
                  <button
                    type="button"
                    className="view-all-btn"
                    onClick={() => onNavigate("Add Property")}
                  >
                    Check Listing →
                  </button>
                </div>
              </div>
              <p>
                Both features are available in the Add Property section.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
export default Dashboard;
