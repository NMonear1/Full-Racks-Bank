import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Account.css";

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
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
      const response = await fetch(import.meta.env.VITE_API + "/accounts", {
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

    const formatAccountNumber = (accountNumber) => {
      return accountNumber.slice(-4).padStart(accountNumber.length, "*");
    };

    const formatBalance = (balance) => {
      return balance
        .toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
        .format(balance);
    };

    if (loading) {
      return <div className="account-loading">Loading accounts...</div>;
    }

    if (error) {
      return <div className="account-error">Error: {error}</div>;
    }

    return (
      <div className="account">
        <h1 className="account-heading">Account summary</h1>
        <ul>
          {accounts.map((account) => (
            <Link
              key={account.id}
              to={`/accounts/${account.type}`}
              className="account-link"
            >
              <li className="account-li">
                <h2 className="account-h2">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
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
              </li>
            </Link>
          ))}
          <div className="account-link account-link-disabled">
            <li className="account-li account-li-disabled">
              <h2 className="account-h2">Credit Card</h2>
              <div className="account-div">
                <p className="account-p coming-soon">Coming Soon</p>
              </div>
            </li>
          </div>
        </ul>
      </div>
    );
  };
}
