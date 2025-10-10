import { Link } from "react-router"
// import Checking from "./Checking"
// import Savings from "./Savings"

export default function Account() {
  return (
    <>
      <div className="account"> 
        <h1>Account summary</h1>
        <ul>
          
          <li>
            <Link to="/checking"><h2>Checking</h2></Link>
          </li>
          <li>
            <Link to="/savings"><h2>Savings</h2></Link>
          </li>
      </ul>
      </div>
    </>
  )
}
