import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
function App() {
  const [page, setPage] = useState("login");
  const [activePage, setActivePage] = useState("Dashboard");
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
        />
      )}
    </>
  );
}
export default App;