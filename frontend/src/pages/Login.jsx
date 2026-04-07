import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user, data.token);
      navigate("/properties");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Sign in</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: 14,
          marginBottom: "2rem",
        }}
      >
        Don't have an account? <Link to="/signup">Sign up</Link>
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
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
