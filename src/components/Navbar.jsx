import "./Navbar.css";
import LoginForm from "./LoginForm";
import { useState } from "react";

export default function BankingNavbar() {
  const [loginFormOpen, setLoginFormOpen] = useState(false);

  const menuItems = ["Checking", "Savings & CDs", "Credit cards", "Loans"];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="logo-container">
              <img src="/public/fullrackslogo.png" className="logo"></img>
            </div>
            <div className="desktop-menu">
              {menuItems.map((item, index) => (
                <a key={index} href="#" className="menu-item">
                  {item}
                </a>
              ))}
            </div>
            <div className="desktop-auth">
              <a
                href="#"
                className="sign-in"
                onClick={(e) => {
                  e.preventDefault();
                  setLoginFormOpen(true);
                }}
              >
                Log in
              </a>
              <a href="#" className="open-account">
                Open account
              </a>
            </div>
          </div>
        </div>
      </nav>
      <LoginForm
        isOpen={loginFormOpen}
        onClose={() => setLoginFormOpen(false)}
      />
    </>
  );
}
