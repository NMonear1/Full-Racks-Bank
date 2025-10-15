import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./loginForm.css";

export default function LoginForm({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
      }

      const token = await response.text();

      localStorage.setItem("token", token);

      onClose();
      navigate("/account");

      setUsername("");
      setPassword("");
      setRememberMe(false);
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <button className="form-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="form-header">
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">
            Welcome back! Please sign in to your account.
          </p>
        </div>
        <div className="form-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button
            onClick={handleSubmit}
            className="signin-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
