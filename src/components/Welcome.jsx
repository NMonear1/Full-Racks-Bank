import { CreditCard, Wallet, Home, TrendingUp } from "lucide-react";
import "./welcomePage.css";
import { Link } from "react-router";

export default function WelcomePage() {
  const products = [
    {
      title: "Checking Accounts",
      icon: <Wallet size={48} />,
      tagline: "Banking made simple",
      description:
        "No monthly fees, free ATM access nationwide, and mobile check deposit. Get your paycheck up to 2 days early with direct deposit.",
      features: [
        "$0 monthly fee",
        "Free debit card",
        "Mobile banking",
        "Overdraft protection",
      ],
      link: "/checking"
    },
    {
      title: "Savings Accounts",
      icon: <TrendingUp size={48} />,
      tagline: "Grow your money",
      description:
        "Competitive interest rates with no minimum balance. Watch your savings grow with our high-yield savings account.",
      features: [
        "2.5% APY",
        "No minimum balance",
        "FDIC insured",
        "Auto-save options",
      ],
      link: "/savings"
    },
    {
      title: "Credit Cards",
      icon: <CreditCard size={48} />,
      tagline: "Rewards that matter",
      description:
        "Earn cash back on every purchase. No annual fee and 0% intro APR for 12 months. Plus, travel insurance included.",
      features: [
        "3% cash back",
        "$0 annual fee",
        "0% intro APR",
        "Fraud protection",
      ],
      link: "/creditcard"
    },
    {
      title: "Home Loans",
      icon: <Home size={48} />,
      tagline: "Your dream home awaits",
      description:
        "Low rates and flexible terms. Get pre-approved in minutes. Our loan experts will guide you through every step.",
      features: [
        "Low rates from 6.2%",
        "Fast approval",
        "Expert guidance",
        "Flexible terms",
      ],
    },
  ];

  return (
    <div className="welcome-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to FullRacks Bank</h1>
          <p className="hero-subtitle">
            Banking that works for you. Simple, secure, and always by your side.
          </p>
          <div className="hero-buttons">
            <a href="#" className="hero-btn-primary">
              Get Started
            </a>
            <a href="#" className="hero-btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>
      <section className="products">
        <div className="products-container">
          <h2 className="products-title">Our Products</h2>
          <p className="products-subtitle">
            Discover the perfect banking solution for your needs
          </p>

          <div className="product-grid">
            {products.map((product, index) => (
              <div key={index} className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-icon">{product.icon}</div>
                    <h3 className="card-title">{product.title}</h3>
                    <p className="card-tagline">{product.tagline}</p>
                    <p className="card-hover-hint">Hover to learn more</p>
                  </div>

                  <div className="flip-card-back">
                    <h3 className="card-title-back">{product.title}</h3>
                    <p className="card-description">{product.description}</p>
                    <ul className="card-features">
                      {product.features.map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
<Link to={"./register"} className="card-btn">
  Apply Now
</Link>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
