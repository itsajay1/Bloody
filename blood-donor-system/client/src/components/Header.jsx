import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#914b4bff' }}>
      <h1>Blood Donor System</h1>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/register">Register Donor</Link>
        <Link to="/request">Request Blood</Link>
      </nav>
    </header>
  );
}

export default Header;
