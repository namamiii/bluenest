import { useState } from "react";
import "./Login.css";
import { loginUser } from "../components/api.js";
function Login({ onSignup, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    loginUser(username, password)
      .then((data) => {
        console.log("Login response:", data);
        console.log("Response keys:", Object.keys(data || {}));
        if (data?.access) {
          localStorage.setItem("access", data.access);
          onLoginSuccess();
        } else {
          setError(
            data?.detail ||
              data?.error ||
              data?.message ||
              "Login failed. Access token was not received."
          );
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Unable to connect to the server. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="left-content">
          <div className="auth-logo">
            <img
              src="/images/logo.jpeg"
              alt="BlueNest logo"
            />
            <h2>BlueNest</h2>
          </div>

          <h1>Find a place to call home.</h1>
          <p>Your next chapter starts with the right home.</p>
        </div>
      </div>
      <div className="login-right">
        <h1>Welcome Back!</h1>
        <p>Login to your account</p>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="signup">
          Don't have an account?{" "}
          <a
            href="#signup"
            onClick={(event) => {
              event.preventDefault();
              onSignup();
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
export default Login;