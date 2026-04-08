import { useState, useEffect } from "react";

function App() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  // User data state
  const [users, setUsers] = useState([]);

  // Property data state
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyMessage, setPropertyMessage] = useState("");

  // Form handlers
  const changeName = (e) => {
    setName(e.target.value);
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  // User API calls
  const submitForm = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    setResponse(data.message);
    setName("");
    setEmail("");
    setPassword("");
    getAllUsers();
  };

  const getAllUsers = async () => {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setUsers(data.users);
  };

  // Property API calls
  const getAllProperties = async () => {
    const response = await fetch("http://localhost:3000/api/properties/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setProperties(data.properties || []);
  };

  const fetchProperty = async (id) => {
    const property = properties.find((p) => p.id == id);
    if (property) {
      setSelectedProperty(property);
      setPropertyMessage("");
    } else {
      setSelectedProperty(null);
      setPropertyMessage("Property not found.");
    }
  };

  const getPropertyById = async (e) => {
    e.preventDefault();
    fetchProperty(selectedPropertyId);
  };

  const deleteProperty = async (id) => {
    setProperties(properties.filter((p) => p.id != id));
    setPropertyMessage("Property deleted");
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    getAllUsers();
    getAllProperties();
  }, []);

  return (
    <div className="app-container">
      {/* User Signup Section */}
      <section className="signup-section">
        <h4>Response: {response}</h4>
        <form onSubmit={submitForm}>
          <input
            type="text"
            value={name}
            onChange={changeName}
            placeholder="Your name"
          />
          <input
            type="text"
            value={email}
            onChange={changeEmail}
            placeholder="Your email"
          />
          <input
            type="text"
            value={password}
            onChange={changePassword}
            placeholder="Password"
          />
          <button type="submit">Signup</button>
        </form>
      </section>

      {/* Users List Section */}
      <section className="users-section">
        <h1>List of users</h1>
        {users.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </section>

      <hr />

      {/* Property Management Section */}
      <section className="property-section">
        <h1>Property management</h1>
        <button type="button" onClick={getAllProperties}>
          Refresh Properties
        </button>
        <p>{propertyMessage}</p>

        <form onSubmit={getPropertyById}>
          <input
            type="number"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            placeholder="Property ID"
          />
          <button type="submit">Get Property</button>
        </form>

        {selectedProperty && (
          <div className="selected-property">
            <h2>Selected Property</h2>
            <p>
              <strong>ID:</strong>
              {' '}
              {selectedProperty.id}
            </p>
            <p>
              <strong>Title:</strong>
              {' '}
              {selectedProperty.title}
            </p>
            <p>
              <strong>Price:</strong>
              {' '}
              ${selectedProperty.price}
            </p>
            <p>
              <strong>Description:</strong>
              {' '}
              {selectedProperty.description}
            </p>
            <p>
              <strong>Location:</strong>
              {' '}
              {selectedProperty.location}
            </p>
            <p>
              <strong>Image:</strong>
              {' '}
              {selectedProperty.image}
            </p>
            <p>
              <strong>User ID:</strong>
              {' '}
              {selectedProperty.user_id}
            </p>
            <button
              type="button"
              onClick={() => deleteProperty(selectedProperty.id)}
            >
              Delete Selected Property
            </button>
          </div>
        )}
      </section>

      {/* All Properties Section */}
      <section className="all-properties-section">
        <h2>All Properties</h2>
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <strong>{property.title}</strong>
              {' '}
              -
              {' '}
              ${property.price}
              {' '}
              -
              {' '}
              {property.location}
              <button type="button" onClick={() => fetchProperty(property.id)}>
                View
              </button>
              <button type="button" onClick={() => deleteProperty(property.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
