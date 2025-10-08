import { NavLink } from "react-router";
import "./Navbar.css";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <nav id="navbar">
      <NavLink id="brand" to="/">
        <p>Home</p>
      </NavLink>
        {token ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
  );
}
