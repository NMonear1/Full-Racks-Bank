import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "./Account-info.css";

export default function AccountInfo() {
  const { accountId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  // const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [showDeposits, setShowDeposits] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);

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

  if (loading) {
    return <div className="loading">Loading account...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!account) {
    return <div className="error">Account not found</div>;
  }

  return (
    <>
      <header className="account-header">
        <h1>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</h1>
        <nav className="account-nav">
          <Link to="/account" className="back-to-account">
            <h3>&larr; Back to Account Summary</h3>
          </Link>
          {userAccounts.length > 0 && (
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
      <div className="account-info">
        <p>Account number: {formatAccountNumber(account.account_number)}</p>
        <p>Routing number: {account.routing_number}</p>
        <p>Available balance: {formatBalance(account.balance)}</p>
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
  );
}
