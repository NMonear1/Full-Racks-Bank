import { useState } from 'react';
import './Checking.css';

export default function Checking() {
  const [showTransactions, setShowTransactions] = useState(false);
  const [showDeposits, setShowDeposits] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);

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

  return (
    <>
      <header className='checking-header'>
      <h1>Checking</h1>
      <button>
        switch account
      </button>
      </header>
      <div className='checking-info'>
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