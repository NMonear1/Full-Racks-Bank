import { useState } from 'react';
import { Link } from 'react-router';
import { NavLink } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import './Account-info.css';

export default function Savings() {
  const [showTransactions, setShowTransactions] = useState(false);
  const [showDeposits, setShowDeposits] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { token, user } = useAuth();

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

    if (!token || !user) {
    return (
      <div className="login-prompt">
        <h1>Please Log In</h1>
        <p>You need to be logged in to view your savings account.</p>
        <Link to="/login" className="login-link">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <>
     <header className="account-header">
        <h1>Savings</h1>
        <nav className="account-nav">
          <NavLink to="/account" className="back-to-account">
            <h3>&larr; Back to Account Summary</h3>
          </NavLink>
          <menu
            className="switch-account"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <h3>Switch Account</h3>
            {showAccountMenu && (
              <div className="account-menu">
                <Link to={"/account/checking"} className="menu-item">
                  Checking Account
                </Link>
                <Link to={"/account/creditcard"} className="menu-item">
                  Credit Card
                </Link>
              </div>
            )}
          </menu>
        </nav>
      </header>
      <div className='account-info'>
      <p>Account number: 5555-55555</p>      
      <p>Routing number: 000000000</p>
      <p>Available balance: $$$$$$</p>
      </div>
      <section className='activity'>
        <header>
        <h2>Activity</h2>
        </header>
        <nav>
          <button onClick={handleViewTransactions}>
            Transactions
          </button>
          <button onClick={handleViewWithdrawals}>
            Withdrawals
          </button>
          <button onClick={handleViewDeposits}>
            Deposits
          </button>
        </nav>
        
        {showTransactions && (
          <div className='history'>
            <h3>Transactions</h3>
            <ul>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
            </ul>
          </div>
        )}

        {showWithdrawals && (
          <div className='history'>
            <h3>Withdrawal history</h3>
            <ul>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
            </ul>
          </div>
        )}
        
        {showDeposits && (
          <div className='history'>
            <h3>Deposit history</h3>
            <ul>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
              <li>
                <p>amount</p>
                <p>description</p>
                <p>date</p>
              </li>
            </ul>
          </div>
        )}
      </section>
    </>
  );
}