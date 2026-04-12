import { useState, useEffect } from "react";

export default function Dashboard({ user, onLogout }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [users, setUsers] = useState([]);

  // Property states
  const [properties, setProperties] = useState([]);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [propertyBedrooms, setPropertyBedrooms] = useState("");
  const [propertyBathrooms, setPropertyBathrooms] = useState("");
  const [propertyArea, setPropertyArea] = useState("");
  const [propertyImageUrl, setPropertyImageUrl] = useState("");
  const [propertyImageFile, setPropertyImageFile] = useState(null);
  const [propertyImagePreview, setPropertyImagePreview] = useState("");
  const [propertyMessage, setPropertyMessage] = useState("");
  
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  function handleImageFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPropertyImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPropertyImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  async function submitForm(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    setResponse(data.message);
    setName("");
    setEmail("");
    setPassword("");
    getAllUsers();
  }

  async function getAllUsers() {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    setUsers(data.users);
  }

  async function getAllProperties() {
    const response = await fetch("http://localhost:3000/api/properties/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    setProperties(data.properties || []);
  }

  async function addProperty(e) {
    e.preventDefault();

    if (!propertyTitle || !propertyPrice || !propertyDescription || !propertyLocation) {
      setPropertyMessage("Please fill in all required fields (Title, Price, Description, Location)");
      return;
    }

    try {
      let imageData = propertyImageUrl || "";

      // If file is selected, use the preview (base64)
      if (propertyImageFile) {
        imageData = propertyImagePreview;
      }

      const response = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: propertyTitle,
          price: propertyPrice,
          description: propertyDescription,
          location: propertyLocation,
          bedrooms: propertyBedrooms || 0,
          bathrooms: propertyBathrooms || 0,
          area: propertyArea || 0,
          image: imageData,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setPropertyMessage("Property added successfully!");
        setPropertyTitle("");
        setPropertyPrice("");
        setPropertyDescription("");
        setPropertyLocation("");
        setPropertyBedrooms("");
        setPropertyBathrooms("");
        setPropertyArea("");
        setPropertyImageUrl("");
        setPropertyImageFile(null);
        setPropertyImagePreview("");
        getAllProperties();
        setTimeout(() => setPropertyMessage(""), 3000);
      } else {
        console.log('Error response:', data);
        setPropertyMessage(data.error || "Failed to add property");
      }
    } catch (err) {
      console.error('Catch error:', err);
      setPropertyMessage(`Error: ${err.message || 'Failed to add property'}`);
    }
  }

  async function searchPropertyByName(e) {
    e.preventDefault();
    
    if (!selectedPropertyId.trim()) {
      setPropertyMessage("Please enter a property name to search");
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/properties/search?title=${encodeURIComponent(selectedPropertyId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.properties && data.properties.length > 0) {
        setSearchResults(data.properties);
        setPropertyMessage(`Found ${data.properties.length} property(ies) matching "${selectedPropertyId}"`);
      } else {
        setSearchResults([]);
        setPropertyMessage(`No properties found matching "${selectedPropertyId}"`);
      }
    } catch (err) {
      setPropertyMessage("Error searching properties");
      setSearchResults([]);
      console.error(err);
    }
  }

  async function deleteProperty(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id != id));
        setPropertyMessage("Property deleted successfully");
        if (selectedProperty?.id === id) {
          setSelectedProperty(null);
        }
        getAllProperties();
      } else {
        const data = await response.json();
        setPropertyMessage(data.error || "Failed to delete property");
      }
    } catch (err) {
      setPropertyMessage("Error deleting property");
      console.error(err);
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllProperties();
  }, []);

  return (
    <div>
      <nav className="navbar">
        <h1>🏠 Real Estate Management</h1>
        <div className="navbar-buttons">
          <span style={{ paddingRight: "1rem", color: "white", fontWeight: "600" }}>
            Welcome, {user?.name}!
          </span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-message">
          <h3>Welcome back, {user?.name}!</h3>
          <p>You are logged in as: {user?.email}</p>
        </div>

        <div className="main-content">
          <div className="section left-section">
            <h2>Add Team Member</h2>
            <p>Create new account for team members</p>

            {response && (
              <div className="message message-success">{response}</div>
            )}

            <form onSubmit={submitForm}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={changeName}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={changeEmail}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={changePassword}
                  placeholder="Enter password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Team Member
              </button>
            </form>
          </div>

          <div className="section right-section">
            <h2>Team Members</h2>
            <p>All registered team members ({users.length})</p>

            <div className="users-list">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#999", textAlign: "center" }}>
                  No team members yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="section full-width">
          <h2>Add New Property</h2>
          <p>List a new property for your real estate portfolio</p>

          {propertyMessage && (
            <div className={`message ${propertyMessage.includes("success") ? "message-success" : propertyMessage.includes("Error") || propertyMessage.includes("Failed") ? "message-error" : "message-info"}`}>
              {propertyMessage}
            </div>
          )}

          <form onSubmit={addProperty}>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="propertyTitle">Property Title *</label>
                <input
                  id="propertyTitle"
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="e.g., Modern Apartment in Downtown"
                  required
                />
              </div>

              <div className="form-group half">
                <label htmlFor="propertyPrice">Price ($) *</label>
                <input
                  id="propertyPrice"
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  placeholder="e.g., 500000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="propertyLocation">Location *</label>
                <input
                  id="propertyLocation"
                  type="text"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>

              <div className="form-group half">
                <label htmlFor="propertyArea">Area (sq ft)</label>
                <input
                  id="propertyArea"
                  type="number"
                  value={propertyArea}
                  onChange={(e) => setPropertyArea(e.target.value)}
                  placeholder="e.g., 2500"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group third">
                <label htmlFor="propertyBedrooms">Bedrooms</label>
                <input
                  id="propertyBedrooms"
                  type="number"
                  value={propertyBedrooms}
                  onChange={(e) => setPropertyBedrooms(e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="form-group third">
                <label htmlFor="propertyBathrooms">Bathrooms</label>
                <input
                  id="propertyBathrooms"
                  type="number"
                  value={propertyBathrooms}
                  onChange={(e) => setPropertyBathrooms(e.target.value)}
                  placeholder="e.g., 2"
                />
              </div>

              <div className="form-group third">
                <label htmlFor="propertyImageFile">Upload Image</label>
                <input
                  id="propertyImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
              </div>

              <div className="form-group third">
                <label htmlFor="propertyImageUrl">Image URL (Cloud)</label>
                <input
                  id="propertyImageUrl"
                  type="text"
                  value={propertyImageUrl}
                  onChange={(e) => setPropertyImageUrl(e.target.value)}
                  placeholder="e.g., https://..."
                />
              </div>
            </div>

            {propertyImagePreview && (
              <div className="form-group">
                <label>Image Preview</label>
                <div style={{ marginBottom: "1rem", height: "150px", overflow: "hidden", borderRadius: "5px", background: "#f0f0f0" }}>
                  <img src={propertyImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="propertyDescription">Description *</label>
              <textarea
                id="propertyDescription"
                value={propertyDescription}
                onChange={(e) => setPropertyDescription(e.target.value)}
                placeholder="Describe the property details..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Property
            </button>
          </form>
        </div>

        <div className="properties-section">
          <div className="section">
            <h2>Search Property</h2>
            <p>Find properties by name</p>

            {propertyMessage && (
              <div className="message message-info">{propertyMessage}</div>
            )}

            <form onSubmit={searchPropertyByName}>
              <div className="form-group">
                <label htmlFor="propertyName">Property Name</label>
                <input
                  id="propertyName"
                  type="text"
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  placeholder="Enter property name"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ color: "#0056b3", marginBottom: "1rem" }}>Search Results</h3>
                <div className="properties-grid">
                  {searchResults.map((property) => (
                    <div key={property.id} className="property-card">
                      <h4>{property.title}</h4>
                      {property.image && (
                        <div style={{ marginBottom: "1rem", height: "150px", overflow: "hidden", borderRadius: "5px", background: "#f0f0f0" }}>
                          <img src={property.image} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div className="property-info">
                        <div className="property-info-item">
                          <strong>Price</strong>
                          <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                            ${parseFloat(property.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="property-info-item">
                          <strong>Location</strong>
                          <span>{property.location}</span>
                        </div>
                        <div className="property-info-item">
                          <strong>Bedrooms</strong>
                          <span>{property.bedrooms || 0}</span>
                        </div>
                        <div className="property-info-item">
                          <strong>Bathrooms</strong>
                          <span>{property.bathrooms || 0}</span>
                        </div>
                        <div className="property-info-item">
                          <strong>Area</strong>
                          <span>{property.area || 0} sq ft</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "#666", marginTop: "1rem", minHeight: "40px" }}>
                        {property.description}
                      </p>
                      <div className="property-actions">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteProperty(property.id)}
                          style={{ width: "100%" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProperty && (
              <div className="property-card" style={{ marginTop: "1.5rem" }}>
                <h4>{selectedProperty.title}</h4>
                <div className="property-info">
                  <div className="property-info-item">
                    <strong>Price</strong>
                    <span>${parseFloat(selectedProperty.price).toLocaleString()}</span>
                  </div>
                  <div className="property-info-item">
                    <strong>Location</strong>
                    <span>{selectedProperty.location}</span>
                  </div>
                  <div className="property-info-item">
                    <strong>Bedrooms</strong>
                    <span>{selectedProperty.bedrooms || 0}</span>
                  </div>
                  <div className="property-info-item">
                    <strong>Bathrooms</strong>
                    <span>{selectedProperty.bathrooms || 0}</span>
                  </div>
                  <div className="property-info-item">
                    <strong>Area</strong>
                    <span>{selectedProperty.area || 0} sq ft</span>
                  </div>
                </div>
                <p style={{ marginTop: "1rem", color: "#666" }}>{selectedProperty.description}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteProperty(selectedProperty.id)}
                  style={{ marginTop: "1rem" }}
                >
                  Delete Property
                </button>
              </div>
            )}
          </div>

          <div className="section">
            <h2>All Properties</h2>
            <p>View all available properties ({properties.length})</p>

            <div className="properties-grid">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <h4>{property.title}</h4>
                    {property.image && (
                      <div style={{ marginBottom: "1rem", height: "150px", overflow: "hidden", borderRadius: "5px", background: "#f0f0f0" }}>
                        <img src={property.image} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div className="property-info">
                      <div className="property-info-item">
                        <strong>Price</strong>
                        <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                          ${parseFloat(property.price).toLocaleString()}
                        </span>
                      </div>
                      <div className="property-info-item">
                        <strong>Location</strong>
                        <span>{property.location}</span>
                      </div>
                      <div className="property-info-item">
                        <strong>Bedrooms</strong>
                        <span>{property.bedrooms || 0}</span>
                      </div>
                      <div className="property-info-item">
                        <strong>Bathrooms</strong>
                        <span>{property.bathrooms || 0}</span>
                      </div>
                      <div className="property-info-item">
                        <strong>Area</strong>
                        <span>{property.area || 0} sq ft</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#666", marginTop: "1rem", minHeight: "40px" }}>
                      {property.description}
                    </p>
                    <div className="property-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => fetchProperty(property.id)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteProperty(property.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#999", textAlign: "center", gridColumn: "1 / -1" }}>
                  No properties available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
