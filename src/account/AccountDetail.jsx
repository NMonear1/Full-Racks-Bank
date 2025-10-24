import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "./Account-info.css";

export default function AccountInfo() {
  const { accountId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [showDeposits, setShowDeposits] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [showDepositsForm, setShowDepositsForm] = useState(false);
  const [showWithdrawalsForm, setShowWithdrawalsForm] = useState(false);
  const [showSendMoneyForm, setShowSendMoneyForm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAccountData();
    fetchUserAccounts();
  }, [accountId, token]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch account");
      }

      const data = await response.json();
      setAccount(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccounts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserAccounts(data.filter((acc) => acc.id !== parseInt(accountId)));
      }
    } catch (err) {
      console.error("Error fetching user accounts:", err);
    }
  };

  const handleViewTransactions = () => {
    setShowTransactions(true);
    setShowDeposits(false);
    setShowWithdrawals(false);
  };

  const handleViewDeposits = () => {
    setShowDeposits(true);
    setShowTransactions(false);
    setShowWithdrawals(false);
  };

  const handleViewWithdrawals = () => {
    setShowWithdrawals(true);
    setShowTransactions(false);
    setShowDeposits(false);
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance);
  };

  const formatAccountNumber = (accountNumber) => {
    return accountNumber.slice(-4).padStart(accountNumber.length, "*");
  };

return (
  <>
    <header className="account-header">
      <h1>
        {account?.type 
          ? account.type.charAt(0).toUpperCase() + account.type.slice(1) + " - " + formatAccountNumber(account.account_number)
          : "Account Details"
        }
      </h1>
      <nav className="account-nav">
        <Link to="/account" className="back-to-account">
          <h3>&larr; Back to Account Summary</h3>
        </Link>
        {userAccounts.length > 0 && !loading && !error && (
          <menu
            className="switch-account"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <h3>Switch Account</h3>
            {showAccountMenu && (
              <div className="account-menu">
                {userAccounts.map((acc) => (
                  <Link
                    key={acc.id}
                    to={`/account/${acc.id}`}
                    className="menu-item"
                  >
                    {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)} -{" "}
                    {formatAccountNumber(acc.account_number)}
                  </Link>
                ))}
              </div>
            )}
          </menu>
        )}
      </nav>
    </header>

    {/* Show loading/error states */}
    {loading && (
      <div className="loading">Loading account...</div>
    )}

    {error && (
      <div className="error">Error: {error}</div>
    )}

    {!account && !loading && !error && (
      <div className="error">Account not found</div>
    )}

    {/* Only show content when account is loaded */}
    {!loading && !error && account && (
      <>
        <div className="account-info">
          <p>Account number: {formatAccountNumber(account.account_number)}</p>
          <p>Routing number: {account.routing_number}</p>
        </div>
        
        <div className="balance-card">
          <h2>Account Balance</h2>
          <p className="balance-amount">{formatBalance(account.balance)}</p>
        </div>
        
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => setShowDepositsForm(true)}
          >
            Make a Deposit
          </button>
          <button
            className="action-btn"
            onClick={() => setShowWithdrawalsForm(true)}
          >
            Pay a Bill
          </button>
          <button
            className="action-btn"
            onClick={() => setShowSendMoneyForm(true)}
          >
            Send Money
          </button>
        </div>

        <section className="activity">
          <header>
            <h2>Activity</h2>
          </header>
          <nav>
            <button onClick={handleViewTransactions}>Transactions</button>
            <button onClick={handleViewWithdrawals}>Withdrawals</button>
            <button onClick={handleViewDeposits}>Deposits</button>
          </nav>

          {showTransactions && (
            <div className="history">
              <h3>Transactions</h3>
              <ul>
                <li>
                  <p>Coming soon - transaction history</p>
                </li>
              </ul>
            </div>
          )}

          {showWithdrawals && (
            <div className="history">
              <h3>Withdrawal history</h3>
              <ul>
                <li>
                  <p>Coming soon - withdrawal history</p>
                </li>
              </ul>
            </div>
          )}

          {showDeposits && (
            <div className="history">
              <h3>Deposit history</h3>
              <ul>
                <li>
                  <p>Coming soon - deposit history</p>
                </li>
              </ul>
            </div>
          )}
        </section>
      </>
    )}

    {/* Forms - these can be outside the conditional since they have their own show state */}
    {showDepositsForm && (
      <div className="form-overlay" onClick={() => setShowDepositsForm(false)}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <button
            className="close-form"
            onClick={() => setShowDepositsForm(false)}
          >
            X
          </button>
          <h3 className="form-title">Deposit Funds</h3>
          <input type="number" placeholder="Amount" />
          <button
            className="submit-btn"
            onClick={() => alert("Deposit successful")}
          >
            Submit Deposit
          </button>
        </div>
      </div>
    )}

    {showWithdrawalsForm && (
      <div className="form-overlay" onClick={() => setShowWithdrawalsForm(false)}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <button
            className="close-form"
            onClick={() => setShowWithdrawalsForm(false)}
          >
            X
          </button>
          <h3 className="form-title">Pay a Bill</h3>
          <input type="number" placeholder="Amount" />
          <input type="text" placeholder="Payee" />
          <button
            className="submit-btn"
            onClick={() => alert("Payment successful")}
          >
            Submit Payment
          </button>
        </div>
      </div>
    )}

    {showSendMoneyForm && (
      <div className="form-overlay" onClick={() => setShowSendMoneyForm(false)}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <button
            className="close-form"
            onClick={() => setShowSendMoneyForm(false)}
          >
            X
          </button>
          <h3 className="form-title">Send Money</h3>
          <input type="number" placeholder="Amount" />
          <input type="text" placeholder="Recipient Account Number" />
          <button
            className="submit-btn"
            onClick={() => alert("Money sent successfully")}
          >
            Send Money
          </button>
        </div>
      </div>
    )}
  </>
);
}