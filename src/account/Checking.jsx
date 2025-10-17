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
      <heading className='checking-header'>
      <h1>Checking</h1>
      <div>
      <p>Account number: 5555-55555</p>      
      <p>Routing number: 000000000</p>
      <p>Available balance: $$$$$$</p>
      </div>
      </heading>
      <section className='activity'>
        <h2>Activity</h2>
        <nav>
          <ul>
            <li>
              <button onClick={handleViewTransactions}>
                Transactions
              </button>
            </li>     
            <li>
              <button onClick={handleViewWithdrawals}>
                Withdrawals
              </button>
            </li>
            <li>
              <button onClick={handleViewDeposits}>
                Deposits
              </button>
            </li>
          </ul>
        </nav>
        
        {showTransactions && (
          <div>
            <h3>Transactions</h3>
            <ul>
              <li>Transaction 1</li>
              <li>Transaction 2</li>
              <li>Transaction 3</li>
              <li>Transaction 4</li>
              <li>Transaction 5</li>
            </ul>
          </div>
        )}

        {showWithdrawals && (
          <div>
            <h3>Withdrawal history</h3>
            <ul>
              <li>Withdrawal 1</li>
              <li>Withdrawal 2</li>
              <li>Withdrawal 3</li>
              <li>Withdrawal 4</li>
            </ul>
          </div>
        )}
        
        {showDeposits && (
          <div>
            <h3>Deposit history</h3>
            <ul>
              <li>Deposit 1</li>
              <li>Deposit 2</li>
              <li>Deposit 3</li>
              <li>Deposit 4</li>
            </ul>
          </div>
        )}
      </section>
    </>
  );
}   

