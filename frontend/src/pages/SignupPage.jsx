import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Create account</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: 14,
          marginBottom: "2rem",
        }}
      >
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%" }}
          />
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-text-danger)",
              fontSize: 13,
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </div>
  );
}
