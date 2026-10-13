import { useState } from "react";
import "./Login.css"
import { loginUser } from "../components/api.js";
function Login({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function handleLogin(event) {
    event.preventDefault();
    loginUser(username, password).then((data) => {
      console.log(data);
    });
  }
  return (
        <div className="login-page">
         <div className="login-left">
         <div className="left-content">
            <h2>BlueNest</h2>
             <h1>Find a place to call home.</h1>
             <p>Your next chapter starts with the right home. </p>
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
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
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