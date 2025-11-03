
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router'; 
import "./Footer.css"

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <img src="/fullrackslogo.png" className="footer-logo" />
            <p className="footer-description">
              Your trusted financial partner. Banking made simple, secure, and always by your side.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
              <a href="#" className="social-icon"><Linkedin size={20} /></a>
            </div>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Products</h3>
            <ul className="footer-links">
              <li><Link to={"/account"}>Checking Accounts</Link></li>
              <li><Link to={"/account"}>Savings & CDs</Link></li>
              <li><Link to={"/account"}>Credit Cards</Link></li>
              <li><Link to={"/account"}>Loans</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Locations</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <Phone size={16} />
                <span>1-800-FULLRACKS</span>
              </li>
              <li>
                <Mail size={16} />
                <span>support@fullracks.com</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>123 fullrack Street, Fullracks, NY 010101</span>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Newsletter</h3>
            <p className="newsletter-text">Stay updated with our latest offers and news.</p>
            <div className="newsletter-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button onClick={handleNewsletterSubmit} className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2025 FullRacks Bank. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#">Terms of Service</a>
            <span className="separator">|</span>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}