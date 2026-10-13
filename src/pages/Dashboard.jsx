import "./Dashboard.css";
import MyProperties from "./Myproperties";
function Dashboard({ activePage, onNavigate }) {
  const menuItems = [
    "Dashboard",
    "My Properties",
    "Add Property",
    "Tenants & Leases",
    "Payments",
    "Market Insights",
  ];
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo"> BlueNest</h2>
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
          <input
            type="text"
            placeholder="Search anything..."
            className="search-input"
          />
          <div className="user-info">
            <span>Welcome, User</span>
            <div className="user-avatar">U</div>
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
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Total Properties</p>
                    <span className="stat-icon properties-icon">⌂</span>
                  </div>
                  <h2>--</h2>
                  <span className="stat-note">
                    Properties you manage
                  </span>
                </div>
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Monthly Income</p>
                    <span className="stat-icon income-icon">₹</span>
                  </div>
                  <h2>--</h2>
                  <span className="stat-note">
                    Monthly rental income
                  </span>
                </div>
                <div className="stat-card">
                  <div className="stat-card-top">
                    <p>Pending Dues</p>
                    <span className="stat-icon dues-icon">!</span>
                  </div>
                  <h2>--</h2>
                  <span className="stat-note">
                    Payments awaiting collection
                  </span>
                </div>
              </div>
              <section className="properties-section">
                <div className="section-heading">
                  <div>
                    <h2>Recent Properties</h2>
                    <p>
                      Keep track of the properties you manage.
                    </p>
                  </div>
                  <button
                    className="view-all-btn"
                    onClick={() => onNavigate("My Properties")} >
                    View all →
                  </button>
                </div>
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <h3>No properties to show yet</h3>
                  <p>
                    Your properties will appear here once
                    property details are available.
                  </p>
                  <button
                    className="empty-action-btn"
                    onClick={() => onNavigate("Add Property")}
                  >
                    + Add your first property
                  </button>
                </div>
              </section>
            </>
          )}

          {activePage === "My Properties" && (
             <MyProperties
             onAddProperty={() => onNavigate("Add Property")}
             />
         )}

          {activePage !== "Dashboard" &&
            activePage !== "My Properties" && (
              <div className="welcome-section">
                <h1>{activePage}</h1>
                <p>This section is under development.</p>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;