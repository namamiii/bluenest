import "./Signup.css";
function Signup({ onLogin }) {
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
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            required
          />
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            required
          />
          <button type="submit">Create Account</button>
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