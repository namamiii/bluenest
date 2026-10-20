import { useState } from "react";
import "./Addproperty.css";
import {
  createProperty,
  uploadPropertyImage,
} from "../components/api.js";
function AddProperty() {
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [address, setAddress] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [bhk, setBhk] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [size, setSize] = useState("950");
  const [floor, setFloor] = useState("0");
  const [furnishing, setFurnishing] = useState("unfurnished");
  const [tenantPreference, setTenantPreference] = useState("family");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("");
    const token = localStorage.getItem("access");
    if (!token) {
      setMessage("Please log in again before adding a property.");
      setMessageType("error");
      return;
    }
    const city = address.includes(",")
      ? address.split(",").pop().trim()
      : address.trim();
    const propertyData = {
      title,
      description,
      property_type: propertyType.toLowerCase(),
      address,
      city,
      locality: address,
      bhk: Number(bhk),
      bathrooms: Number(bathrooms),
      size_sqft: Number(size),
      floor: Number(floor),
      furnishing_status: furnishing,
      tenant_preference: tenantPreference,
      asking_rent: Number(rent),
      image: null,
    };
    setLoading(true);
    try {
      const result = await createProperty(propertyData, token);

      console.log("Property created:", result);
      console.log(
        "Property response:",
        JSON.stringify(result, null, 2)
      );
      if (imageFile) {
        const propertyId =
          result.data?.id ??
          result.id ??
          result.property?.id ??
          result.property_id;
        if (propertyId == null) {
          setMessage(
            "Property created, but its ID was not found. Check the console response."
          );
          setMessageType("error");
          return;
        }
        await uploadPropertyImage(propertyId, imageFile, token);
      }
      setMessage(
        imageFile
          ? "Property and image added successfully!"
          : "Property added successfully!"
      );
      setMessageType("success");
      setTitle("");
      setPropertyType("");
      setAddress("");
      setRent("");
      setDescription("");
      setBhk("2");
      setBathrooms("2");
      setSize("950");
      setFloor("0");
      setFurnishing("unfurnished");
      setTenantPreference("family");
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      console.error("Add property error:", error);
      setMessage(error.message || "Unable to add property.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="add-property-page">
      <div className="add-property-heading">
        <div>
          <p className="eyebrow">PROPERTY MANAGEMENT</p>
          <h1>Add a New Property</h1>
          <p className="add-property-subtitle">
            Add your property details to manage your rental portfolio.
          </p>
        </div>
        <div className="add-property-heading-icon">⌂</div>
      </div>
      <form className="property-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <div className="form-section-heading">
            <div className="form-section-icon">01</div>
            <div>
              <h2>Basic Information</h2>
              <p>Start with the basic details of your property.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="property-title">Property Name *</label>
              <input
                id="property-title"
                type="text"
                placeholder="e.g. Green Valley Apartment"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="property-type">Property Type *</label>
              <select
                id="property-type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                required
              >
                <option value="">Select property type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="property-size">Property Size (sq ft) *</label>
              <input
                id="property-size"
                type="number"
                min="1"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="property-bhk">Bedrooms (BHK) *</label>
              <select
                id="property-bhk"
                value={bhk}
                onChange={(event) => setBhk(event.target.value)}
                required
              >
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="property-bathrooms">Bathrooms *</label>
              <select
                id="property-bathrooms"
                value={bathrooms}
                onChange={(event) => setBathrooms(event.target.value)}
                required
              >
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>
        </section>
        <section className="form-section">
          <div className="form-section-heading">
            <div className="form-section-icon">02</div>
            <div>
              <h2>Location &amp; Rent</h2>
              <p>Help tenants understand the location and rental price.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="property-address">Full Location *</label>
              <input
                id="property-address"
                type="text"
                placeholder="e.g. Sector 62, Noida, Uttar Pradesh"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
              />
              <span className="field-hint">
                Include locality and city for better location details.
              </span>
            </div>
            <div className="form-field">
              <label htmlFor="property-rent">Monthly Rent (₹) *</label>
              <div className="rent-input-wrap">
                <span>₹</span>
                <input
                  id="property-rent"
                  type="number"
                  placeholder="15000"
                  min="1"
                  value={rent}
                  onChange={(event) => setRent(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="property-floor">Floor Number *</label>
              <input
                id="property-floor"
                type="number"
                min="0"
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="property-furnishing">Furnishing Status *</label>
              <select
                id="property-furnishing"
                value={furnishing}
                onChange={(event) => setFurnishing(event.target.value)}
                required
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi_furnished">Semi-furnished</option>
                <option value="furnished">Fully furnished</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="tenant-preference">Tenant Preference *</label>
              <select
                id="tenant-preference"
                value={tenantPreference}
                onChange={(event) => setTenantPreference(event.target.value)}
                required
              >
                <option value="family">Family</option>
                <option value="bachelor">Bachelor</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>
        </section>
        <section className="form-section">
          <div className="form-section-heading">
            <div className="form-section-icon">03</div>
            <div>
              <h2>Property Description</h2>
              <p>Share more details about the property.</p>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="property-description">Description</label>
            <textarea
              id="property-description"
              placeholder="Describe the property, nearby facilities and special features..."
              rows="5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </section>
        <section className="form-section">
          <div className="form-section-heading">
            <div className="form-section-icon">04</div>
            <div>
              <h2>Property Photos</h2>
              <p>Choose a photo for your listing.</p>
            </div>
          </div>
          <label className="image-upload-area" htmlFor="property-image">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected property preview"
                className="property-image-preview"
              />
            ) : (
              <>
                <span className="upload-icon">↑</span>
                <strong>Choose a property photo</strong>
                <span>Click here to select an image from your device</span>
                <span className="upload-format">JPG, PNG or WEBP</span>
              </>
            )}
          </label>
          <input
            id="property-image"
            className="hidden-file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
          />
          <p className="field-hint">
            The selected photo will be uploaded when you add the property.
          </p>
        </section>
        {message && (
          <div className={`form-message ${messageType}`} role="status">
            {message}
          </div>
        )}
        <div className="form-actions">
          <p>* Required fields</p>
          <button
            type="submit"
            className="add-property-button"
            disabled={loading}
          >
            {loading ? "Adding Property..." : "Add Property →"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddProperty;
