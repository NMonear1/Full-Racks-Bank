import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import "./Register.css";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    email: "",
    phonenumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    SSN: "",
    citizenship: false,
    creditscore: 0,
    accountType: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstname.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastname.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.birthday) {
      setError("Birthday is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.phonenumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.SSN.trim()) {
      setError("Social Security Number is required");
      return false;
    }
    if (formData.SSN.length !== 9) {
      setError("SSN must be 9 digits");
      return false;
    }
    if (!formData.citizenship) {
      setError("You must confirm citizenship");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.accountType) {
      setError("Please select an account type");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        birthday: formData.birthday,
        email: formData.email,
        phonenumber: formData.phonenumber,
        username: formData.username,
        password: formData.password,
        SSN: formData.SSN,
        citizenship: formData.citizenship,
        creditscore: parseInt(formData.creditscore) || 0,
        accountType: formData.accountType,
      });
      navigate("/account");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Basic Information";
      case 2:
        return "Secure Information";
      case 3:
        return "Account Type";
      default:
        return "";
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">
            Step {step} of 3 - {getStepTitle()}
          </p>
        </div>

        {error && <output className="error-message">{error}</output>}

        <div className="progress-bar">
          <div
            className={`progress-fill`}
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={step === 3 ? onRegister : (e) => e.preventDefault()}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-row">
                <label className="form-label-wrapper">
                  First Name
                  <input
                    type="text"
                    name="firstname"
                    className="form-input"
                    placeholder="John"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="form-label-wrapper">
                  Last Name
                  <input
                    type="text"
                    name="lastname"
                    className="form-input"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="form-label-wrapper">
                Birthday
                <input
                  type="date"
                  name="birthday"
                  className="form-input"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label-wrapper">
                Email
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label-wrapper">
                Phone Number
                <input
                  type="tel"
                  name="phonenumber"
                  className="form-input"
                  placeholder="(123) 456-7890"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="form-step">
              <label className="form-label-wrapper">
                Username
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label-wrapper">
                Password
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label-wrapper">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label-wrapper">
                Social Security Number
                <input
                  type="text"
                  name="SSN"
                  className="form-input"
                  placeholder="123456789"
                  value={formData.SSN}
                  onChange={handleChange}
                  required
                  maxLength="9"
                />
              </label>

              <label className="form-label-wrapper">
                Credit Score (Optional)
                <input
                  type="number"
                  name="creditscore"
                  className="form-input"
                  placeholder="0"
                  value={formData.creditscore}
                  onChange={handleChange}
                  min="0"
                  max="850"
                />
              </label>

              <label className="checkbox-label-wrapper">
                <input
                  type="checkbox"
                  name="citizenship"
                  checked={formData.citizenship}
                  onChange={handleChange}
                  required
                />
                <span>I confirm I am a U.S. citizen</span>
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="form-step">
              <p className="account-type-description">
                Which account type would you like to open?
              </p>

              <div className="account-type-options">
                <label className="account-type-card">
                  <input
                    type="radio"
                    name="accountType"
                    value="checking"
                    checked={formData.accountType === "checking"}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <div className="account-type-content">
                    <h3>Checking Account</h3>
                    <p>
                      Perfect for everyday banking with free ATM access and
                      mobile check deposit.
                    </p>
                  </div>
                </label>

                <label className="account-type-card">
                  <input
                    type="radio"
                    name="accountType"
                    value="savings"
                    checked={formData.accountType === "savings"}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <div className="account-type-content">
                    <h3>Savings Account</h3>
                    <p>
                      Grow your money with competitive interest rates and no
                      minimum balance.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
          <div className="button-group">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePreviousStep}
                disabled={isLoading}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
