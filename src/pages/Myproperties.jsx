import "./Dashboard.css";
function MyProperties({ onAddProperty }) {
  return (
    <div className="page-content my-properties-page">
      <div className="my-properties-heading">
        <div>
          <p className="eyebrow">PROPERTY MANAGEMENT</p>
          <h1>My Properties</h1>
          <p className="my-properties-subtitle">
            View and manage all your properties in one place.
          </p>
        </div>
        <button
          className="add-property-button"
          onClick={onAddProperty}
        >
          + Add Property
        </button>
      </div>
      <div className="my-properties-container">
        <div className="my-properties-empty">
          <div className="my-properties-icon">
          </div>
          <h2>No properties added yet</h2>
          <p>
            Your properties will appear here when property
            details are available.
          </p>
        </div>
      </div>
    </div>
  );
}
export default MyProperties;