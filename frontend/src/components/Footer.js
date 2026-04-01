import { Link } from "react-router-dom";
import logo from "../assets/meetmypet-logo.png";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link className="footer-brand" to="/">
          <img className="footer-logo" src={logo} alt="Meet My Pet logo" />
        </Link>
        <p>Address: 123 ABC Street, VKK 2KK</p>
        <p>Phone Number: 604-124-3333</p>
      </div>

      <nav className="footer-links" aria-label="Footer">
        <Link to="/pet-list">Pet Listing</Link>
        <Link to="/about">About Us</Link>
        <Link to="/pet-list">Pet Posting</Link>
        <Link to="/pet-list">Shipping Policy</Link>
        <Link to="/pet-list">Refund Policy</Link>
        <Link to="/about">FAQ</Link>
      </nav>

      <div className="footer-contact">
        <h2>CONTACT FORM</h2>
        <p>Need Help? Don&apos;t hesitate to reach out! We are here to help!</p>
        <form className="footer-form">
          <input type="email" placeholder="Email" />
          <textarea placeholder="Question" rows="4" />
          <button type="button">Send</button>
        </form>
      </div>
    </footer>
  );
}

export default Footer;
