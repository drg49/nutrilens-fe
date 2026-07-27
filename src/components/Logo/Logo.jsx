import React from 'react';
import './Logo.scss';
import logo from '../../images/logo.png';

/**
 * The Match logo, with icon and text.
 */
const Logo = ({ size = '3x' }) => {
  return (
    <div className="app-logo no-select">
      <span>
        <img
          src={logo}
          alt="NutriLens AI Logo"
          style={{ width: '60px', height: '60px' }}
        />
      </span>
      <h1>NutriLens AI</h1>
    </div>
  );
};

export default Logo;
