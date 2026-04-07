import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function SinglePropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchProperty() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/properties/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProperty(data.property);
        setForm({
          title: data.property.title,
          price: data.property.price,
          description: data.property.description,
          image: data.property.image,
          location: data.property.location,
        });
      } else {
        setMessage(data.error || "Property not found.");
      }
    } catch {
      setMessage("Failed to load property.");
    } finally {
      setLoading(false);
    }
  }

  async function updateProperty(e) {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setEditing(false);
      fetchProperty();
    } else {
      setMessage(data.error || "Failed to update.");
    }
  }

  async function deleteProperty() {
    const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      navigate("/properties");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to delete.");
    }
  }

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const isOwner = user?.id === property?.user_id;

  if (loading)
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      </div>
    );

  if (message && !property)
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
        <button
          onClick={() => navigate("/properties")}
          style={{ marginBottom: "1rem" }}
        >
          ← Back
        </button>
        <p style={{ color: "var(--color-text-danger)" }}>{message}</p>
      </div>
    );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <button
        onClick={() => navigate("/properties")}
        style={{ marginBottom: "1.5rem" }}
      >
        ← Back to properties
      </button>

      {property.image && !editing && (
        <img
          src={property.image}
          alt={property.title}
          style={{
            width: "100%",
            height: 280,
            objectFit: "cover",
            borderRadius: "var(--border-radius-lg)",
            marginBottom: "1.5rem",
          }}
        />
      )}

      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
        }}
      >
        {editing ? (
          <>
            <h2 style={{ marginTop: 0 }}>Edit property</h2>
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
                    style={{ width: "100%" }}
                  />
                </div>
              ),
            )}
            {message && (
              <p style={{ color: "var(--color-text-danger)", fontSize: 13 }}>
                {message}
              </p>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={updateProperty}>Save changes</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h1 style={{ margin: 0, fontSize: 22 }}>{property.title}</h1>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "var(--color-text-secondary)",
                    fontSize: 14,
                  }}
                >
                  {property.location}
                </p>
              </div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 20 }}>
                ${Number(property.price).toLocaleString()}
              </p>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              {property.description}
            </p>

            <div
              style={{
                borderTop: "0.5px solid var(--color-border-tertiary)",
                paddingTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                }}
              >
                Listed by {property.User?.name || "unknown"} · ID #{property.id}
              </p>
              {isOwner && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setEditing(true)}>Edit</button>
                  <button
                    onClick={deleteProperty}
                    style={{
                      color: "var(--color-text-danger)",
                      borderColor: "var(--color-border-danger)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
