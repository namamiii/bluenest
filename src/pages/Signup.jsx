import { useState } from "react";
import "./Signup.css";
import { registerUser } from "../components/api.js";
function Signup({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSignup(event) {
    event.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    const nameParts = fullName.trim().split(/\s+/);
    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }
    const userData = {
      username: email.trim(),
      email: email.trim(),
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || nameParts[0],
      password,
      role,
      phone: phone.trim(),
    };
    setLoading(true);
    try {
      const result = await registerUser(userData);
      console.log("Signup response:", result);
      setMessage("Account created successfully! You can now log in.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setRole("tenant");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-left">
        <h2>BlueNest</h2>
        <p>Smarter Renting. Better Living.</p>
        <h1>Find Your Place</h1>
        <p>Create your account and start your rental journey.</p>
      </div>
      <div className="login-right">
        <h1>Create Account</h1>
        <p>Join BlueNest today</p>
        <form onSubmit={handleSignup}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <label>Account Type</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {message && <p role="status">{message}</p>}
        </form>
        <p className="signup">
          Already have an account?{" "}
          <a
            href="#login"
            onClick={(event) => {
              event.preventDefault();
              onLogin();
            }}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
export default Signup;
