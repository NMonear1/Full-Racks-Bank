import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "./Account-info.css";

export default function AccountInfo() {
  const { accountId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [creditCards, setCreditCards] = useState([]);
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
  const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payee, setPayee] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setShowTransactions(false);
    setShowDeposits(false);
    setShowWithdrawals(false);

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
    // Fetch bank accounts
    const accountsResponse = await fetch(`${import.meta.env.VITE_API}/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let accounts = [];
    if (accountsResponse.ok) {
      const accountsData = await accountsResponse.json();
      accounts = accountsData.filter((acc) => acc.id !== parseInt(accountId));
    }

    // Fetch credit cards
    const creditCardsResponse = await fetch(`${import.meta.env.VITE_API}/credit_cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let cards = [];
    if (creditCardsResponse.ok) {
      const cardsData = await creditCardsResponse.json();
      // Filter out current credit card if we're viewing a credit card
      const currentPath = window.location.pathname;
      if (currentPath.includes('/credit-card/')) {
        const currentCardId = parseInt(accountId);
        cards = cardsData.filter((card) => card.id !== currentCardId);
      } else {
        cards = cardsData;
      }
    }

    setUserAccounts(accounts);
    setCreditCards(cards);
  } catch (err) {
    console.error("Error fetching user accounts and credit cards:", err);
  }
};

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchDeposits = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/account/${accountId}/transactions/deposits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      }
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchWithdrawals = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/account/${accountId}/transactions/withdrawals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleViewTransactions = () => {
    if (showTransactions) {
      setShowTransactions(false);
    } else {
      setShowTransactions(true);
      setShowDeposits(false);
      setShowWithdrawals(false);
      fetchTransactions();
    }
  };

  const handleViewDeposits = () => {
    if (showDeposits) {
      setShowDeposits(false);
    } else {
      setShowDeposits(true);
      setShowTransactions(false);
      setShowWithdrawals(false);
      fetchDeposits();
    }
  };

  const handleViewWithdrawals = () => {
    if (showWithdrawals) {
      setShowWithdrawals(false);
    } else {
      setShowWithdrawals(true);
      setShowTransactions(false);
      setShowDeposits(false);
      fetchWithdrawals();
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance);
  };

  const formatAccountNumber = (accountNumber, showFull = false) => {
    if (showFull) return accountNumber;
    return accountNumber.slice(-4).padStart(accountNumber.length, "*");
  };

  const formatCreditCardNumber = (cardNumber) => {
  return "**** **** **** " + cardNumber.slice(-4);
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTransactionTypeLabel = (type) => {
    const labels = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      transfer_in: "Transfer In",
      transfer_out: "Transfer Out",
    };
    return labels[type] || type;
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to deposit");
      }

      setSuccessMessage(`Successfully deposited ${formatBalance(amount)}`);
      setDepositAmount("");
      await fetchAccountData();

      setTimeout(() => {
        setShowDepositsForm(false);
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    if (!payee || payee.trim() === "") {
      setFormError("Please enter a payee name");
      return;
    }

    if (amount > account.balance) {
      setFormError("Insufficient funds");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, payee }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payment");
      }

      setSuccessMessage(
        `Successfully paid ${formatBalance(amount)} to ${payee}`
      );
      setWithdrawAmount("");
      setPayee("");
      await fetchAccountData();

      setTimeout(() => {
        setShowWithdrawalsForm(false);
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    if (!recipientAccount || recipientAccount.trim() === "") {
      setFormError("Please enter a recipient account number");
      return;
    }

    if (amount > account.balance) {
      setFormError("Insufficient funds");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/account/${accountId}/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            to_account_number: recipientAccount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transfer money");
      }

      setSuccessMessage(`Successfully sent ${formatBalance(amount)}`);
      setTransferAmount("");
      setRecipientAccount("");
      await fetchAccountData();

      setTimeout(() => {
        setShowSendMoneyForm(false);
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeDepositForm = () => {
    setShowDepositsForm(false);
    setDepositAmount("");
    setFormError("");
    setSuccessMessage("");
  };

  const closeWithdrawalForm = () => {
    setShowWithdrawalsForm(false);
    setWithdrawAmount("");
    setPayee("");
    setFormError("");
    setSuccessMessage("");
  };

  const closeTransferForm = () => {
    setShowSendMoneyForm(false);
    setTransferAmount("");
    setRecipientAccount("");
    setFormError("");
    setSuccessMessage("");
  };

  return (
    <>
      <header className="account-header">
        <h1>
          {account?.type
            ? account.type.charAt(0).toUpperCase() +
              account.type.slice(1) +
              " - " +
              formatAccountNumber(account.account_number)
            : "Account Details"}
        </h1>
        <nav className="account-nav">
          <Link to="/account" className="back-to-account">
            <h3>&larr; Back to Account Summary</h3>
          </Link>
{(userAccounts.length > 0 || creditCards.length > 0) && !loading && !error && (
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
            key={`account-${acc.id}`}
            to={`/account/${acc.id}`}
            className="menu-item"
          >
            <span className="account-type">
              {acc.type.charAt(0).toUpperCase() + acc.type.slice(1) + " Account"}
              <br />
            </span>
            <span className="account-number">
              {formatAccountNumber(acc.account_number)}
            </span>
          </Link>
        ))}
        {creditCards.map((card) => (
          <Link
            key={`credit-${card.id}`}
            to={`/credit-card/${card.id}`}
            className="menu-item"
          >
            <span className="account-type">
              {card.card_type} Credit Card
              <br />
            </span>
            <span className="account-number">
              {formatCreditCardNumber(card.card_number)}
            </span>
          </Link>
        ))}
      </div>
    )}
  </menu>
)}
        </nav>
      </header>

      {loading && <div className="loading">Loading account...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!account && !loading && !error && (
        <div className="error">Account not found</div>
      )}

      {!loading && !error && account && (
        <>
          <div className="account-info">
            <p>
              Account number:{" "}
              {formatAccountNumber(
                account.account_number,
                showFullAccountNumber
              )}
              <button
                className="view-toggle-btn"
                onClick={() => setShowFullAccountNumber(!showFullAccountNumber)}
              >
                {showFullAccountNumber ? "Hide" : "View"}
              </button>
            </p>
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
                <h3>All Transactions</h3>
                {loadingTransactions ? (
                  <p>Loading transactions...</p>
                ) : transactions.length > 0 ? (
                  <ul>
                    {transactions.map((txn) => (
                      <li key={txn.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">
                            {getTransactionTypeLabel(txn.transaction_type)}
                          </span>
                          <span className="transaction-description">
                            {txn.description}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <span
                            className={`transaction-amount ${
                              txn.transaction_type === "deposit" ||
                              txn.transaction_type === "transfer_in"
                                ? "positive"
                                : "negative"
                            }`}
                          >
                            {txn.transaction_type === "deposit" ||
                            txn.transaction_type === "transfer_in"
                              ? "+"
                              : "-"}
                            {formatBalance(txn.amount)}
                          </span>
                          <span className="transaction-date">
                            {formatDate(txn.created_at)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No transactions found</p>
                )}
              </div>
            )}

            {showWithdrawals && (
              <div className="history">
                <h3>Withdrawal History</h3>
                {loadingTransactions ? (
                  <p>Loading withdrawals...</p>
                ) : withdrawals.length > 0 ? (
                  <ul>
                    {withdrawals.map((txn) => (
                      <li key={txn.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">
                            {getTransactionTypeLabel(txn.transaction_type)}
                          </span>
                          <span className="transaction-description">
                            {txn.description}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-amount negative">
                            -{formatBalance(txn.amount)}
                          </span>
                          <span className="transaction-date">
                            {formatDate(txn.created_at)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No withdrawals found</p>
                )}
              </div>
            )}

            {showDeposits && (
              <div className="history">
                <h3>Deposit History</h3>
                {loadingTransactions ? (
                  <p>Loading deposits...</p>
                ) : deposits.length > 0 ? (
                  <ul>
                    {deposits.map((txn) => (
                      <li key={txn.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">
                            {getTransactionTypeLabel(txn.transaction_type)}
                          </span>
                          <span className="transaction-description">
                            {txn.description}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-amount positive">
                            +{formatBalance(txn.amount)}
                          </span>
                          <span className="transaction-date">
                            {formatDate(txn.created_at)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No deposits found</p>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {showDepositsForm && (
        <div className="form-overlay" onClick={closeDepositForm}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-form" onClick={closeDepositForm}>
              X
            </button>
            <h3 className="form-title">Deposit Funds</h3>
            <form onSubmit={handleDeposit}>
              <input
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                disabled={submitting}
              />
              {formError && <p className="form-error">{formError}</p>}
              {successMessage && (
                <p className="form-success">{successMessage}</p>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Submit Deposit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showWithdrawalsForm && (
        <div className="form-overlay" onClick={closeWithdrawalForm}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-form" onClick={closeWithdrawalForm}>
              X
            </button>
            <h3 className="form-title">Pay a Bill</h3>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Payee"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                required
                disabled={submitting}
              />
              {formError && <p className="form-error">{formError}</p>}
              {successMessage && (
                <p className="form-success">{successMessage}</p>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Submit Payment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSendMoneyForm && (
        <div className="form-overlay" onClick={closeTransferForm}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-form" onClick={closeTransferForm}>
              X
            </button>
            <h3 className="form-title">Send Money</h3>
            <form onSubmit={handleTransfer}>
              <input
                type="number"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Recipient Account Number"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                required
                disabled={submitting}
              />
              {formError && <p className="form-error">{formError}</p>}
              {successMessage && (
                <p className="form-success">{successMessage}</p>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Send Money"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
