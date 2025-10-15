import { Link } from "react-router";
// import "./Account.css"

// import Checking from "./Checking"
// import Savings from "./Savings"

export default function Account() {
  return (
    <>
      <div className="account">
        <h1 className="account-heading">Account summary</h1>
        <ul>
          <Link to="/checking">
            <li className="checking">
              <h2>Checking</h2>
              <div>
                <p>Account number: 5555-55555</p>
                <p>Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
          <Link to="/savings">
            <li className="savings">
              <h2>Savings</h2>
              <div>
                <p>Account number: 4444-44444</p>
                <p>Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
          <Link to="/creditcard">
            <li>
              <h2>Credit Card</h2>
              <div>
                <p>Card number: 3333-33333</p>
                <p>Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}