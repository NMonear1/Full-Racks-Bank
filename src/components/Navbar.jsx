import "./Navbar.css";
import LoginForm from "../auth/Login";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function BankingNavbar() {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { token, logout } = useAuth();

  const menuItems = [
    { name: "Checking" },
    { name: "Savings & CDs" },
    { name: "Credit cards" },
    { name: "Loans" },
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

  const handleMenuClick = (e) => {
    e.preventDefault();
    setShowLoginPrompt(true);
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginPromptConfirm = () => {
    setShowLoginPrompt(false);
    setLoginFormOpen(true);
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
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="menu-item"
                  onClick={(e) => handleMenuClick(e, item)}
                >
                  {item.name}
                </a>
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
                <NavLink to="/account" className="account-navlink">
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

      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={handleLoginPromptClose}>
          <div
            className="login-prompt-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="login-prompt-title">Login Required</h3>
            <p className="login-prompt-message">
              Please log in to access our banking services.
            </p>
            <div className="login-prompt-buttons">
              <button
                className="login-prompt-btn login-prompt-cancel"
                onClick={handleLoginPromptClose}
              >
                Cancel
              </button>
              <button
                className="login-prompt-btn login-prompt-confirm"
                onClick={handleLoginPromptConfirm}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}