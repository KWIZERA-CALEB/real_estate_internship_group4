import { useState } from "react";

export default function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending session cookies
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        setEmail("");
        setPassword("");
        // Call the callback to switch to dashboard
        setTimeout(() => onLoginSuccess(), 1000);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Log In</h1>
        <p>Access your real estate portfolio</p>

        {message && <div className="message message-success">{message}</div>}
        {error && <div className="message message-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <a onClick={onSwitchToSignup} style={{ cursor: "pointer" }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
