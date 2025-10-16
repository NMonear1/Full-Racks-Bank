import "./Navbar.css";
import LoginForm from "../auth/Login";
import { useState } from "react";
import { NavLink } from "react-router";

export default function BankingNavbar() {
  const [loginFormOpen, setLoginFormOpen] = useState(false);

  const menuItems = [
    { name: "Account", path: "/account" },
    { name: "Checking", path: "/checking" },
    { name: "Savings & CDs", path: "/savings" },
    { name: "Credit cards", path: "/creditcard" },
    { name: "Loans", path: "/loans" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <NavLink to={"/"} className="logo-container">
              <img src="/fullrackslogo.png" className="logo"></img>
            </NavLink>
            <div className="desktop-menu">
              {menuItems.map((item, index) => (
                <NavLink key={index} to={item.path} className="menu-item">
                  {item.name}
                </NavLink>
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
