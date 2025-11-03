import "./Navbar.css";
import LoginForm from "../auth/Login";
import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

// Add a custom event name for account/card refresh
const REFRESH_ACCOUNTS_EVENT = "refreshAccounts";

export default function BankingNavbar() {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const { token, logout } = useAuth();

  const menuItems = [
    { name: "Checking" },
    { name: "Savings & CDs" },
    { name: "Credit cards" },
    { name: "Stocks" },
    { name: "Loans" },
  ];

  // Use useCallback to avoid unnecessary re-renders
  const fetchUserAccounts = useCallback(async () => {
    try {
      // Fetch bank accounts
      const accountsResponse = await fetch(
        `${import.meta.env.VITE_API}/account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let accounts = [];
      if (accountsResponse.ok) {
        accounts = await accountsResponse.json();
      }

      // Fetch credit cards
      const creditCardsResponse = await fetch(
        `${import.meta.env.VITE_API}/credit_cards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let cards = [];
      if (creditCardsResponse.ok) {
        cards = await creditCardsResponse.json();
      }

      setUserAccounts(accounts);
      setCreditCards(cards);
    } catch (err) {
      console.error("Error fetching user accounts and credit cards:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserAccounts();
    }
  }, [token, fetchUserAccounts]);

  // Listen for custom event to refresh accounts/cards
  useEffect(() => {
    const handler = () => {
      fetchUserAccounts();
    };
    window.addEventListener(REFRESH_ACCOUNTS_EVENT, handler);
    return () => window.removeEventListener(REFRESH_ACCOUNTS_EVENT, handler);
  }, [fetchUserAccounts]);

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
                <NavLink to="./register" className="open-account">
                  Open account
                </NavLink>
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
                {token &&
                  (userAccounts.length > 0 || creditCards.length > 0) && (
                    <menu
                      className="switch-account"
                      onMouseEnter={() => setShowAccountMenu(true)}
                      onMouseLeave={() => setShowAccountMenu(false)}
                      style={{
                        display: "inline-block",
                        marginLeft: "1.5rem",
                      }}
                    >
                      <h3 style={{ cursor: "pointer", margin: 0 }}>
                        Switch Account
                      </h3>
                      {showAccountMenu && (
                        <div className="account-menu">
                          {/* Checking accounts first */}
                          {userAccounts
                            .filter((acc) => acc.type === "checking")
                            .map((acc) => (
                              <NavLink
                                key={`account-${acc.id}`}
                                to={`/account/${acc.id}`}
                                className="menu-item"
                              >
                                <span className="account-type">
                                  {acc.type.charAt(0).toUpperCase() +
                                    acc.type.slice(1) +
                                    " "}
                                </span>
                                <span className="account-number">
                                  {acc.account_number
                                    ? acc.account_number
                                        .slice(-4)
                                        .padStart(acc.account_number.length, "*")
                                    : ""}
                                </span>
                              </NavLink>
                            ))}
                          {/* Savings accounts next */}
                          {userAccounts
                            .filter((acc) => acc.type === "savings")
                            .map((acc) => (
                              <NavLink
                                key={`account-${acc.id}`}
                                to={`/account/${acc.id}`}
                                className="menu-item"
                              >
                                <span className="account-type">
                                  {acc.type.charAt(0).toUpperCase() +
                                    acc.type.slice(1) +
                                    " "}
                                </span>
                                <span className="account-number">
                                  {acc.account_number
                                    ? acc.account_number
                                        .slice(-4)
                                        .padStart(acc.account_number.length, "*")
                                    : ""}
                                </span>
                              </NavLink>
                            ))}
                          {/* Credit cards last */}
                          {creditCards.map((card) => (
                            <NavLink
                              key={`credit-${card.id}`}
                              to={`/credit-card/${card.id}`}
                              className="menu-item"
                            >
                              <span className="account-type">
                                {card.card_type} Credit Card
                                <br />
                              </span>
                              <span className="account-number">
                                {"**** **** **** " + card.card_number.slice(-4)}
                              </span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </menu>
                  )}
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