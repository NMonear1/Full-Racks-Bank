import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { MoreVertical } from "lucide-react";
import "./Account.css";
import CreditScore from "./CreditScore.jsx";

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showCreditCardDialog, setShowCreditCardDialog] = useState(false);
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
      fetchCreditCards();
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

  const fetchCreditCards = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API + "/credit_cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch credit cards");
      }
      const data = await response.json();
      setCreditCards(data);
    } catch (error) {
      console.error("Error fetching credit cards:", error.message);
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
      window.dispatchEvent(new Event("refreshAccounts"));
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

  const openNewCreditCard = async () => {
    try {
      // Determine credit limit based on credit score
      let creditLimit;
      if (user?.creditscore >= 600) {
        creditLimit = Math.min(user.creditscore * 10, 10000);
      } else if (user?.creditscore >= 500) {
        creditLimit = 1000;
      } else {
        creditLimit = 500;
      }

      // Create the request body with the credit limit
      const requestBody = {
        credit_limit: creditLimit,
      };

      const response = await fetch(import.meta.env.VITE_API + "/credit_cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), // Pass the object with credit_limit
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to open credit card: ${errorText}`);
      }

      const newCard = await response.json();
      console.log("Credit card created successfully:", newCard);

      fetchCreditCards();
      alert("Credit card opened successfully!");
      window.dispatchEvent(new Event("refreshAccounts"));
    } catch (err) {
      console.error("Full error:", err);
      alert("Error opening credit card: " + err.message);
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
      window.dispatchEvent(new Event("refreshAccounts"));
    } catch (err) {
      alert("Error closing account: " + err.message);
    }
  };

  const closeCreditCard = async (cardId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this credit card? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/credit_cards/${cardId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to close credit card");
      }

      fetchCreditCards();
      alert("Credit card closed successfully");
      window.dispatchEvent(new Event("refreshAccounts"));
    } catch (err) {
      alert("Error closing credit card: " + err.message);
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

  const formatCreditCardNumber = (cardNumber) => {
    return "**** **** **** " + cardNumber.slice(-4);
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
              {/* Render checking accounts first */}
              {accounts
                .filter((acc) => acc.type === "checking")
                .map((account) => (
                  <div key={account.id} className="account-card-wrapper">
                    <Link
                      to={`/account/${account.id}`}
                      className="account-link"
                    >
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

              {/* Then render savings accounts */}
              {accounts
                .filter((acc) => acc.type === "savings")
                .map((account) => (
                  <div key={account.id} className="account-card-wrapper">
                    <Link
                      to={`/account/${account.id}`}
                      className="account-link"
                    >
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

              {creditCards.map((card) => (
                <div key={`credit-${card.id}`} className="account-card-wrapper">
                  <Link to={`/credit-card/${card.id}`} className="account-link">
                    <div className="account-item">
                      <h2 className="account-h2">
                        {card.card_type} Credit Card
                      </h2>
                      <div className="account-div">
                        <p className="account-p">
                          Card number:{" "}
                          {formatCreditCardNumber(card.card_number)}
                        </p>
                        <p className="account-p">
                          Available credit:{" "}
                          {formatBalance(
                            card.credit_limit - card.current_balance
                          )}
                        </p>
                        <p className="account-p">
                          Outstanding balance: {formatBalance(card.current_balance)}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Add options menu for credit cards */}
                  <div className="account-options">
                    <button
                      className="options-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdownId(
                          openDropdownId === `credit-${card.id}`
                            ? null
                            : `credit-${card.id}`
                        );
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openDropdownId === `credit-${card.id}` && (
                      <div className="options-dropdown">
                        <button
                          className="dropdown-item dropdown-item-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            closeCreditCard(card.id);
                          }}
                        >
                          Close Credit Card
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
                        <p className="account-p">Manage your daily expenses</p>
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

              {creditCards.length === 0 && (
                <div className="account-card-wrapper">
                  <div className="account-link account-link-open">
                    <div className="account-item">
                      <h2 className="account-h2">Credit Card</h2>
                      <div className="account-div">
                        <>
                          <p className="account-p">
                            Build credit and earn rewards
                          </p>
                          <button
                            onClick={openNewCreditCard}
                            className="open-account-btn"
                          >
                            Apply for Credit Card
                          </button>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="account-card-wrapper">
                <Link to="/stocks" className="account-link"
                style = {{ marginRight: "5rem" }}
                >
                  <div className="account-item">
                    <h2 className="account-h2">Stocks</h2>
                    <div className="account-div">
                      <p className="account-p">
                        Invest in the stock market and grow your wealth
                      </p>
                      <button className="open-account-btn">View Stocks</button>
                    </div>
                  </div>
                </Link>
              </div>
            </ul>
            <div className="open-another-container">
              <button
                className="open-another-btn"
                onClick={() => setShowDialog(true)}
              >
                + Open New Account
              </button>
              <button
                className="open-another-btn"
                onClick={() => setShowCreditCardDialog(true)}
                style={{ marginLeft: "1rem" }}
              >
                + Open New Credit Card
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
      {showCreditCardDialog && (
        <div
          className="dialog-overlay"
          onClick={() => setShowCreditCardDialog(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">Apply for a New Credit Card</h2>
            <p className="dialog-subtitle">
              Build credit and earn rewards. Credit score of 600+ recommended.
            </p>
            <div className="dialog-buttons">
              <button
                className="dialog-btn dialog-btn-cancel"
                onClick={() => setShowCreditCardDialog(false)}
              >
                Cancel
              </button>
              <button
                className="dialog-btn dialog-btn-confirm"
                onClick={() => {
                  setShowCreditCardDialog(false);
                  openNewCreditCard();
                }}
                // disabled={user?.creditscore < 600}
              >
                Open Credit Card
              </button>
            </div>
            {/* {user?.creditscore < 600 && (
              <p
                className="form-warning"
                style={{ color: "#e53e3e", marginTop: "1rem" }}
              >
                Credit score of 600+ required to open a credit card.
              </p>
            )} */}
          </div>
        </div>
      )}
    </>
  );
}
