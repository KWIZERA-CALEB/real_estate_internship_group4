import { useState, useEffect } from "react";
import "./styles.css";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function App() {
  const [authState, setAuthState] = useState("login"); // "login", "signup", "dashboard"
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/current-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setAuthState("dashboard");
      } else {
        setAuthState("login");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setAuthState("login");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkAuthStatus();
  };

  const handleSignupSuccess = () => {
    setAuthState("login");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setCurrentUser(null);
        setAuthState("login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading</div>;
  }

  return (
    <>
      {authState === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthState("signup")}
        />
      )}

      {authState === "signup" && (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthState("login")}
        />
      )}

      {authState === "dashboard" && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;

