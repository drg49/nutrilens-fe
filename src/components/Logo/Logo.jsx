import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKitchenSet } from '@fortawesome/free-solid-svg-icons';
import './Logo.scss';

/**
 * The Match logo, with icon and text.
 */
const Logo = ({ size = '3x' }) => {
  return (
    <div className="app-logo no-select">
      <span>
        <FontAwesomeIcon
          icon={faKitchenSet}
          size={size}
          color="rgb(99, 99, 255)"
        />
      </span>
      <h1>NutriLens AI</h1>
    </div>
  );
};

export default Logo;
