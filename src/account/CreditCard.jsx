import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import "./Account-info.css";

export default function CreditCard() {
  const { accountId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [creditCard, setCreditCard] = useState(null);
  // const [creditCards, setCreditCards] = useState([]);
  // const [userAccounts, setUserAccounts] = useState([]);
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactions, setShowTransactions] = useState(true);
  const [showPayments, setShowPayments] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [merchant, setMerchant] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setShowTransactions(true);
    setShowPayments(false);
    setShowPurchases(false);

    fetchCreditCardData();
    // fetchUserAccountsAndCards();
  }, [accountId, token]);

    useEffect(() => {
    // Fetch transactions automatically when showTransactions is true
    if (showTransactions) {
      fetchTransactions();
    }
  }, [showTransactions, accountId, token]);

  const fetchCreditCardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API}/credit_cards/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch credit card");
      }

      const data = await response.json();
      setCreditCard(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const fetchUserAccountsAndCards = async () => {
  //   try {
  //     // Fetch bank accounts
  //     const accountsResponse = await fetch(
  //       `${import.meta.env.VITE_API}/account`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     let accounts = [];
  //     if (accountsResponse.ok) {
  //       accounts = await accountsResponse.json();
  //     }

  //     // Fetch credit cards
  //     const creditCardsResponse = await fetch(
  //       `${import.meta.env.VITE_API}/credit_cards`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     let cards = [];
  //     if (creditCardsResponse.ok) {
  //       const cardsData = await creditCardsResponse.json();
  //       // Optionally filter out the current card
  //       cards = cardsData.filter((card) => card.id !== parseInt(accountId));
  //     }

  //     setUserAccounts(accounts);
  //     setCreditCards(cards);
  //   } catch (error) {
  //     console.error("Error fetching user accounts and credit cards:", error);
  //   }
  // };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/credit_cards/${accountId}/transactions`,
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
      console.error("Error fetching credit card transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchPayments = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/credit_cards/${accountId}/transactions/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchPurchases = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/credit_cards/${accountId}/transactions/purchases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleViewTransactions = () => {
    if (showTransactions) {
      setShowTransactions(false);
    } else {
      setShowTransactions(true);
      setShowPayments(false);
      setShowPurchases(false);
      fetchTransactions();
    }
  };

  const handleViewPayments = () => {
    if (showPayments) {
      setShowPayments(false);
    } else {
      setShowPayments(true);
      setShowTransactions(false);
      setShowPurchases(false);
      fetchPayments();
    }
  };

  const handleViewPurchases = () => {
    if (showPurchases) {
      setShowPurchases(false);
    } else {
      setShowPurchases(true);
      setShowTransactions(false);
      setShowPayments(false);
      fetchPurchases();
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance);
  };

  const formatCreditCardNumber = (cardNumber) => {
    return "**** **** **** " + cardNumber.slice(-4);
  };
  // const formatAccountNumber = (accountNumber, showFull = false) => {
  //   if (showFull) return accountNumber;
  //   return accountNumber.slice(-4).padStart(accountNumber.length, "*");
  // };

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
      purchase: "Purchase",
      payment: "Payment",
      fee: "Fee",
      interest: "Interest",
      refund: "Refund",
    };
    return labels[type] || type;
  };

const handlePayment = async (e) => {
  e.preventDefault();
  setFormError("");
  setSuccessMessage("");

  const amount = parseFloat(paymentAmount);
  if (!amount || amount <= 0) {
    setFormError("Please enter a valid amount");
    return;
  }

  if (amount > creditCard.current_balance) {
    setFormError("Payment amount cannot exceed current balance");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API}/credit_cards/${accountId}/payment`,
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
      throw new Error(data.error || "Failed to process payment");
    }

    setSuccessMessage(`Successfully paid ${formatBalance(amount)}`);
    setPaymentAmount("");
    await fetchCreditCardData();
    await fetchTransactions(); // <-- Refresh all transactions
    await fetchPayments();     // <-- Refresh payments
    await fetchPurchases();    // <-- Refresh purchases

    setTimeout(() => {
      setShowPaymentForm(false);
      setSuccessMessage("");
    }, 2000);
  } catch (err) {
    setFormError(err.message);
  } finally {
    setSubmitting(false);
  }
};

const handlePurchase = async (e) => {
  e.preventDefault();
  setFormError("");
  setSuccessMessage("");

  const amount = parseFloat(purchaseAmount);
  if (!amount || amount <= 0) {
    setFormError("Please enter a valid amount");
    return;
  }

  if (!merchant || merchant.trim() === "") {
    setFormError("Please enter a merchant name");
    return;
  }

  const availableCredit =
    creditCard.credit_limit - creditCard.current_balance;
  if (amount > availableCredit) {
    setFormError("Purchase amount exceeds available credit");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API}/credit_cards/${accountId}/purchase`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, merchant }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to process purchase");
    }

    setSuccessMessage(
      `Successfully charged ${formatBalance(amount)} at ${merchant}`
    );
    setPurchaseAmount("");
    setMerchant("");
    await fetchCreditCardData();
    await fetchTransactions(); // <-- Refresh all transactions
    await fetchPurchases();    // <-- Refresh purchases
    await fetchPayments();     // <-- Refresh payments

    setTimeout(() => {
      setShowPurchaseForm(false);
      setSuccessMessage("");
    }, 2000);
  } catch (err) {
    setFormError(err.message);
  } finally {
    setSubmitting(false);
  }
};

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setPaymentAmount("");
    setFormError("");
    setSuccessMessage("");
  };

  const closePurchaseForm = () => {
    setShowPurchaseForm(false);
    setPurchaseAmount("");
    setMerchant("");
    setFormError("");
    setSuccessMessage("");
  };

  return (
    <>
      <header className="account-header">
        <h1>
          {creditCard
            ? `${creditCard.card_type} Credit Card - ${formatCreditCardNumber(
                creditCard.card_number
              )}`
            : "Credit Card Details"}
        </h1>
        {/* < */}
      </header>

      {loading && <div className="loading">Loading credit card...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && creditCard && (
        <>
          <div className="account-info">
            <p>
              Card number:{" "}
              {showFullCardNumber
                ? creditCard.card_number
                : formatCreditCardNumber(creditCard.card_number)}
              <button
                className="view-toggle-btn"
                style={{ marginLeft: "0.5rem" }}
                onClick={() => setShowFullCardNumber((v) => !v)}
              >
                {showFullCardNumber ? "Hide" : "View"}
              </button>
            </p>{" "}
            <p>
              Expiration:{" "}
              {new Date(creditCard.expiration_date).toLocaleDateString()}
            </p>
          </div>

          <div className="balance-card">
            <h2>Outstanding Balance</h2>
            <p className="balance-amount">
              {formatBalance(creditCard.current_balance)}
            </p>
          </div>

          <div className="activity">
            <header>
              <h2>Credit Information</h2>
            </header>
            <div className="history credit-info">
              <p className="minimum-payment">
                Minimum Payment of {formatBalance(creditCard.minimum_payment)}{" "}
                due on{" "}
                {new Date(creditCard.payment_due_date).toLocaleDateString()}
              </p>
              <p className="credit-limit">
                Credit Limit: {formatBalance(creditCard.credit_limit)}
              </p>
              <p className="balance">
                Outstanding Balance: {formatBalance(creditCard.current_balance)}
              </p>
              <p className="available-credit">
                Available Credit:{" "}
                {formatBalance(
                  creditCard.credit_limit - creditCard.current_balance
                )}
              </p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={() => setShowPurchaseForm(true)}
            >
              Make a Purchase
            </button>
            <button
              className="action-btn"
              onClick={() => setShowPaymentForm(true)}
            >
              Make a Payment
            </button>
          </div>

          <section className="activity">
            <header>
              <h2>Credit Card Activity</h2>
            </header>
            <nav>
              <button onClick={handleViewTransactions}>All Transactions</button>
              <button onClick={handleViewPurchases}>Purchases</button>
              <button onClick={handleViewPayments}>Payments</button>
            </nav>

            {showTransactions && (
              <div className="history">
                <h3>All Credit Card Transactions</h3>
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
                              txn.transaction_type === "payment" ||
                              txn.transaction_type === "refund"
                                ? "positive"
                                : "negative"
                            }`}
                          >
                            {txn.transaction_type === "payment" ||
                            txn.transaction_type === "refund"
                              ? "-"
                              : "+"}
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

            {showPurchases && (
              <div className="history">
                <h3>Purchase History</h3>
                {loadingTransactions ? (
                  <p>Loading purchases...</p>
                ) : purchases.length > 0 ? (
                  <ul>
                    {purchases.map((txn) => (
                      <li key={txn.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">Purchase</span>
                          <span className="transaction-description">
                            {txn.merchant}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-amount negative">
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
                  <p>No purchases found</p>
                )}
              </div>
            )}

            {showPayments && (
              <div className="history">
                <h3>Payment History</h3>
                {loadingTransactions ? (
                  <p>Loading payments...</p>
                ) : payments.length > 0 ? (
                  <ul>
                    {payments.map((txn) => (
                      <li key={txn.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">Payment</span>
                          <span className="transaction-description">
                            {txn.description}
                          </span>
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-amount positive">
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
                  <p>No payments found</p>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <div className="form-overlay" onClick={closePaymentForm}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-form" onClick={closePaymentForm}>
              X
            </button>
            <h3 className="form-title">Make a Payment</h3>
            <form onSubmit={handlePayment}>
              <input
                type="number"
                placeholder="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                step="0.01"
                min="0.01"
                max={creditCard?.current_balance}
                required
                disabled={submitting}
              />
              <p className="form-info">
                Current Balance:{" "}
                {creditCard && formatBalance(creditCard.current_balance)}
              </p>
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

      {/* Purchase Form */}
      {showPurchaseForm && (
        <div className="form-overlay" onClick={closePurchaseForm}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-form" onClick={closePurchaseForm}>
              X
            </button>
            <h3 className="form-title">Make a Purchase</h3>
            <form onSubmit={handlePurchase}>
              <input
                type="number"
                placeholder="Purchase Amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="Merchant Name"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                required
                disabled={submitting}
              />
              <p className="form-info">
                Available Credit:{" "}
                {creditCard &&
                  formatBalance(
                    creditCard.credit_limit - creditCard.current_balance
                  )}
              </p>
              {formError && <p className="form-error">{formError}</p>}
              {successMessage && (
                <p className="form-success">{successMessage}</p>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Submit Purchase"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
