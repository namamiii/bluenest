import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  getProperties,
  updateProperty,
  deleteProperty,
} from "../components/api.js";
function MyProperties({ onAddProperty }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);
  const [saving, setSaving] = useState(false);
  async function loadProperties() {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("Login token not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const data = await getProperties(token);
      console.log("Properties API response:", data);
      const propertyList = Array.isArray(data)
        ? data
        : data.results || data.properties || [];
      setProperties(propertyList);
      setError("");
    } catch (err) {
      console.error("Fetch properties error:", err);
      setError(err.message || "Unable to load properties.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadProperties();
  }, []);
  function formatPropertyType(type) {
    if (!type) return "";
    return String(type)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  function handleEdit(property) {
    setEditingProperty({
      ...property,
      title: property.title || "",
      address:
        property.address ||
        property.locality ||
        property.city ||
        "",
      asking_rent:
        property.asking_rent ?? property.rent ?? "",
      property_type: property.property_type || "",
      bhk: property.bhk ?? "",
      city: property.city || "",
      locality: property.locality || "",
      size_sqft: property.size_sqft ?? "",
      floor: property.floor ?? "",
      bathrooms: property.bathrooms ?? "",
      furnishing_status: property.furnishing_status || "",
      tenant_preference: property.tenant_preference || "",
    });
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditingProperty((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  async function handleUpdate(event) {
    event.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) {
      setError("Please log in again.");
      return;
    }
    if (editingProperty.id == null) {
      setError("Property ID not found. Cannot update this property.");
      return;
    }
    const requiredFields = [
      ["city", "City"],
      ["locality", "Locality"],
      ["size_sqft", "Property size (sq. ft.)"],
      ["floor", "Floor"],
      ["bathrooms", "Bathrooms"],
      ["furnishing_status", "Furnishing status"],
      ["tenant_preference", "Tenant preference"],
    ];
    const missingFields = requiredFields
      .filter(([field]) => {
        const value = editingProperty[field];
        return value === "" || value === null || value === undefined;
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setError(
        `Please provide the missing details: ${missingFields.join(", ")}.`
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const propertyData = {
        ...editingProperty,
      };
      delete propertyData.id;
      delete propertyData.created_at;
      delete propertyData.updated_at;
      await updateProperty(
        editingProperty.id,
        propertyData,
        token
      );
      setEditingProperty(null);
      await loadProperties();
    } catch (err) {
      console.error("Update property error:", err);
      setError(err.message || "Unable to update property.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(property) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title || "this property"}"?`
    );
    if (!confirmed) return;
    const token = localStorage.getItem("access");
    if (!token) {
      setError("Please log in again.");
      return;
    }
    if (property.id == null) {
      setError("Property ID not found. Cannot delete this property.");
      return;
    }
    setError("");
    try {
      await deleteProperty(property.id, token);
      setProperties((previous) =>
        previous.filter((item) => item.id !== property.id)
      );
      if (editingProperty?.id === property.id) {
        setEditingProperty(null);
      }
    } catch (err) {
      console.error("Delete property error:", err);
      setError(err.message || "Unable to delete property.");
    }
  }
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
      {error && <p role="alert">{error}</p>}
      {editingProperty && (
        <div className="my-properties-container">
          <h2>Edit Property</h2>
          <form onSubmit={handleUpdate}>
            <label>
              Property Title
              <input
                name="title"
                value={editingProperty.title}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address
              <input
                name="address"
                value={editingProperty.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Monthly Rent
              <input
                name="asking_rent"
                type="number"
                min="0"
                value={editingProperty.asking_rent}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Property Type
              <input
                name="property_type"
                value={editingProperty.property_type}
                onChange={handleInputChange}
              />
            </label>
            <label>
              BHK
              <input
                name="bhk"
                type="number"
                min="0"
                value={editingProperty.bhk}
                onChange={handleInputChange}
              />
            </label>
            <button
              type="submit"
              className="add-property-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditingProperty(null)}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className="my-properties-container">
        {loading ? (
          <p>Loading properties...</p>
        ) : properties.length === 0 ? (
          <div className="my-properties-empty">
            <div className="my-properties-icon">⌂</div>
            <h2>No properties added yet</h2>
            <p>Your properties will appear here once available.</p>
          </div>
        ) : (
          <div className="stats-grid">
            {properties.map((property, index) => (
              <div
                className="stat-card"
                key={property.id ?? property.title ?? index}
              >
                <h2>
                  {property.title || "Untitled Property"}
                </h2>
                <p>
                  {property.address ||
                    property.locality ||
                    property.city ||
                    "Location unavailable"}
                </p>
                <p>
                  Monthly Rent: ₹
                  {property.asking_rent ??
                    property.rent ??
                    "N/A"}
                </p>
                <p>
                  Property Type:{" "}
                  {property.property_type
                    ? formatPropertyType(property.property_type)
                    : property.bhk
                      ? `${property.bhk} BHK`
                      : "Property type unavailable"}
                </p>
                <div className="property-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(property)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(property)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default MyProperties;
