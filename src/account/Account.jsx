import { Link } from "react-router";
import "./Account.css"

export default function Account() {
  return (
    <>
      <div className="account">
        <h1 className="account-heading">Account summary</h1>
        <ul>
          <Link to="/checking" className="account-link">
            <li className="account-li">
              <h2 className="account-h2">Checking</h2>
              <div className="account-div">
                <p className="account-p">Account number: 5555-55555</p>
                <p className="account-p">Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
          <Link to="/savings" className="account-link">
            <li className="account-li">
              <h2 className="account-h2">Savings</h2>
              <div className="account-div">
                <p className="account-p">Account number: 4444-44444</p>
                <p className="account-p">Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
          <Link to="/creditcard" className="account-link">
            <li className="account-li">
              <h2 className="account-h2">Credit Card</h2>
              <div className="account-div">
                <p className="account-p">Card number: 3333-33333</p>
                <p className="account-p">Available balance: $$$$$$</p>
              </div>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}