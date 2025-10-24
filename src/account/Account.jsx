import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { MoreVertical } from "lucide-react"; // Add this import
import "./Account.css";
import CreditScore from "./CreditScore.jsx";

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showCreditScore, setShowCreditScore] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Please log in to view your account information.");
      console.log("No token found, redirecting to home page.");
      navigate("/");
    } else {
      fetchAccounts();
    }
  }, [token]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openNewAccount = async (accountType) => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/account/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountType }),
      });

      if (!response.ok) {
        throw new Error("Failed to open account");
      }

      fetchAccounts();
      alert(
        `${
          accountType.charAt(0).toUpperCase() + accountType.slice(1)
        } account opened successfully!`
      );
      setShowDialog(false);
      setSelectedAccountType("");
    } catch (err) {
      alert("Error opening account: " + err.message);
    }
  };

  const closeAccount = async (accountId, accountType) => {
    const confirmed = window.confirm(
      `Are you sure you want to close this ${accountType} account? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to close account");
      }

      fetchAccounts();
      alert("Account closed successfully");
      setOpenDropdownId(null);
    } catch (err) {
      alert("Error closing account: " + err.message);
    }
  };

  const handleOpenAccountSubmit = () => {
    if (!selectedAccountType) {
      alert("Please select an account type");
      return;
    }
    openNewAccount(selectedAccountType);
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance);
  };
  const toggleCreditScore = () => {
    setShowCreditScore(!showCreditScore);
  };
  const formatAccountNumber = (accountNumber) => {
    return accountNumber.slice(-4).padStart(accountNumber.length, "*");
  };

  const hasChecking = accounts.some((acc) => acc.type === "checking");
  const hasSavings = accounts.some((acc) => acc.type === "savings");

  return (
    <>
      <div className="account">
        <header className={showCreditScore ? "no-padding-bottom" : ""}>
          <h1 className="account-heading">Account summary</h1>
          {user?.creditscore ? (
            <button
              onClick={toggleCreditScore}
              className="credit-score-toggle-btn"
            >
              {showCreditScore ? "Close Credit Score" : "View Credit Score"}
            </button>
          ) : null}

          {/* Show CreditScore directly below the button when toggled */}
          {showCreditScore && user?.creditscore && <CreditScore />}
        </header>

        {/* Show loading/error under header */}
        {loading && <div className="account-loading">Loading accounts...</div>}

        {error && <div className="account-error">Error: {error}</div>}

        {/* Only show content when not loading and no error */}
        {!loading && !error && (
          <>
            {!user?.creditscore ? <CreditScore /> : null}

            <ul>
              {accounts.map((account) => (
                <div key={account.id} className="account-card-wrapper">
                  <Link to={`/account/${account.id}`} className="account-link">
                    <div className="account-item">
                      <h2 className="account-h2">
                        {account.type.charAt(0).toUpperCase() +
                          account.type.slice(1)}
                      </h2>
                      <div className="account-div">
                        <p className="account-p">
                          Account number:{" "}
                          {formatAccountNumber(account.account_number)}
                        </p>
                        <p className="account-p">
                          Available balance: {formatBalance(account.balance)}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="account-options">
                    <button
                      className="options-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdownId(
                          openDropdownId === account.id ? null : account.id
                        );
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openDropdownId === account.id && (
                      <div className="options-dropdown">
                        <button
                          className="dropdown-item dropdown-item-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            closeAccount(account.id, account.type);
                          }}
                        >
                          Close Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!hasChecking && (
                <div className="account-card-wrapper">
                  <div className="account-link account-link-open">
                    <div className="account-item">
                      <h2 className="account-h2">Checking</h2>
                      <div className="account-div">
                         <p className="account-p">
                          Manage your daily expenses
                        </p>
                        <button
                          onClick={() => openNewAccount("checking")}
                          className="open-account-btn"
                        >
                          Open Checking Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasSavings && (
                <div className="account-card-wrapper">
                  <div className="account-link account-link-open">
                    <div className="account-item">
                      <h2 className="account-h2">Savings</h2>
                      <div className="account-div">
                        <p className="account-p">
                          Start saving with competitive rates
                        </p>
                        <button
                          onClick={() => openNewAccount("savings")}
                          className="open-account-btn"
                        >
                          Open Savings Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="account-card-wrapper">
                <div className="account-link account-link-disabled">
                  <li className="account-li account-li-disabled">
                    <h2 className="account-h2">Credit Card</h2>
                    <div className="account-div">
                      <p className="account-p coming-soon">Coming Soon</p>
                    </div>
                  </li>
                </div>
              </div>
            </ul>

            <div className="open-another-container">
              <button
                className="open-another-btn"
                onClick={() => setShowDialog(true)}
              >
                + Open Another Account
              </button>
            </div>
          </>
        )}
      </div>

      {showDialog && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">Open a New Account</h2>
            <p className="dialog-subtitle">
              Select the type of account you would like to open
            </p>

            <div className="account-type-options">
              <label className="account-type-option">
                <input
                  type="radio"
                  name="accountType"
                  value="checking"
                  checked={selectedAccountType === "checking"}
                  onChange={(e) => setSelectedAccountType(e.target.value)}
                />
                <div className="account-type-info">
                  <h3>Checking Account</h3>
                  <p>Perfect for everyday transactions</p>
                </div>
              </label>

              <label className="account-type-option">
                <input
                  type="radio"
                  name="accountType"
                  value="savings"
                  checked={selectedAccountType === "savings"}
                  onChange={(e) => setSelectedAccountType(e.target.value)}
                />
                <div className="account-type-info">
                  <h3>Savings Account</h3>
                  <p>Grow your money with interest</p>
                </div>
              </label>
            </div>

            <div className="dialog-buttons">
              <button
                className="dialog-btn dialog-btn-cancel"
                onClick={() => {
                  setShowDialog(false);
                  setSelectedAccountType("");
                }}
              >
                Cancel
              </button>
              <button
                className="dialog-btn dialog-btn-confirm"
                onClick={handleOpenAccountSubmit}
              >
                Open Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
