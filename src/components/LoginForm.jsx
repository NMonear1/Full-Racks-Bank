import { useState } from "react";
import { X } from "lucide-react";
import "./loginForm.css";

export default function LoginForm({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in:", { email, password, rememberMe });
    // Add your sign-in logic here
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
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button onClick={handleSubmit} className="signin-btn">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
