import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    location: "",
  });
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function getAllProperties() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/properties/all");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch {
      setMessage("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }

  async function createProperty(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setForm({
          title: "",
          price: "",
          description: "",
          image: "",
          location: "",
        });
        getAllProperties();
      } else {
        setMessage(data.error || "Failed to create property.");
      }
    } catch {
      setMessage("Failed to create property.");
    }
  }

  async function deleteProperty(id) {
    const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      getAllProperties();
    } else {
      setMessage(data.error || "Failed to delete.");
    }
  }

  useEffect(() => {
    getAllProperties();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Properties</h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            Signed in as {user?.name}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add property"}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>New property</h2>
          {["title", "price", "description", "image", "location"].map(
            (field) => (
              <div key={field} style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                    textTransform: "capitalize",
                  }}
                >
                  {field}
                </label>
                <input
                  type={field === "price" ? "number" : "text"}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  placeholder={field}
                  style={{ width: "100%" }}
                />
              </div>
            ),
          )}
          <button onClick={createProperty}>Create property</button>
        </div>
      )}

      {message && (
        <p
          style={{
            color: "var(--color-text-danger)",
            fontSize: 14,
            marginBottom: "1rem",
          }}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      ) : properties.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>
          No properties yet.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>
                  {property.title}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {property.location} · $
                  {Number(property.price).toLocaleString()} · by{" "}
                  {property.User?.name || "unknown"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => navigate(`/properties/${property.id}`)}>
                  View
                </button>
                {property.user_id === user?.id && (
                  <button
                    onClick={() => deleteProperty(property.id)}
                    style={{
                      color: "var(--color-text-danger)",
                      borderColor: "var(--color-border-danger)",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
