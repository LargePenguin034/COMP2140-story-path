import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ brandText, navLinks }) {
  const location = useLocation();

  return (
    <nav id="header" className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand text-danger"><strong>{brandText}</strong></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav  ms-auto">
            <strong>
            {navLinks.map((link, index) => (
              <li className="nav-item" key={index}> 
                <Link 
                  to={link.path} 
                  className={`nav-link text-primary ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
            </strong>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;