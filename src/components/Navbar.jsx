import "./Navbar.css";
import LoginForm from "../auth/Login";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function BankingNavbar() {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { token, logout } = useAuth();

  const menuItems = [
    { name: "Checking", path: "/account/checking" },
    { name: "Savings & CDs", path: "/account/savings" },
    { name: "Credit cards", path: "/account/creditcard" },
    { name: "Loans", path: "/account/loans" },
  ];

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setUserData(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <NavLink to="/" className="logo-container">
            <img src="/fullrackslogo.png" className="logo" />
          </NavLink>

          {!token && (
            <div className="desktop-menu">
              {menuItems.map((item, index) => (
                <NavLink key={index} to={item.path} className="menu-item">
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}

          <div className="desktop-auth">
            {!token && (
              <>
                <a
                  href="#"
                  className="sign-in"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginFormOpen(true);
                  }}
                >
                  Log in
                </a>
                <a href="/register" className="open-account">
                  Open account
                </a>
              </>
            )}
            {token && (
              <>
                <span className="welcome-text">
                  Welcome {userData?.firstname}
                </span>
                <NavLink to="/account" className="account-link">
                  My Account
                </NavLink>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <LoginForm
        isOpen={loginFormOpen}
        onClose={() => setLoginFormOpen(false)}
      />
    </nav>
  );
}
