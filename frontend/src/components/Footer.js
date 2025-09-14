"use client";

import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="admin-footer">
      <div className="footer-content">
        <div className="flex justify-between items-center">
          <div className="footer-links">
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Safety</a>
              <a href="#">Guidelines</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="social-icons">
            <FaFacebookSquare />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 TravelPro. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
