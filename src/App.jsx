import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { logoutUser } from "./components/api.js";
function App() {
  const [page, setPage] = useState("login");
  const [activePage, setActivePage] = useState("Dashboard");
  async function handleLogout() {
    const refreshToken = localStorage.getItem("refresh");
    const accessToken = localStorage.getItem("access");
    try {
      if (refreshToken) {
        await logoutUser(refreshToken, accessToken);
      }
    } catch (error) {
      console.error("Logout API error:", error.message);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setActivePage("Dashboard");
      setPage("login");
    }
  }
  return (
    <>
      {page === "login" ? (
        <Login
          onSignup={() => setPage("signup")}
          onLoginSuccess={() => {
            setActivePage("Dashboard");
            setPage("dashboard");
          }}
        />
      ) : page === "signup" ? (
        <Signup onLogin={() => setPage("login")} />
      ) : (
        <Dashboard
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
export default App;
