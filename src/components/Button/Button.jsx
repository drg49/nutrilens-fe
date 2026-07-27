import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Button.scss';

const spinner = (
  <FontAwesomeIcon icon={faSpinner} className="app-button-spinner" spin />
);

/**
 * A reusable button component.
 *
 * @param {Object} props - The props object that contains the following:
 * @param {string} props.text - The text to display on the button.
 * @param {function} props.click - The function to execute when the button is clicked.
 * @param {boolean} props.isPrimary - Is this button a primary button?
 * @param {string} props.id - The ID attribute for the button element.
 * @param {boolean} props.isLoading - Is this button in a loading state?
 */
const Button = ({ text, click, isPrimary, id, isLoading }) => {
  return (
    <button
      onClick={click}
      className={`app-button ${isPrimary && 'primary'}`}
      id={id}
      type="button"
      disabled={isLoading}
    >
      {text}
      {isLoading && spinner}
    </button>
  );
};

export default Button;
