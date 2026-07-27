import React from 'react';
import './Input.scss';

/**
 * A reusable input component with an optional label.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.id] - The unique ID of the input.
 * @param {string} [props.type='text'] - The type of the input.
 * @param {string} [props.placeholder] - The placeholder of the input.
 * @param {string} props.name - The name of the input.
 * @param {string|number} props.value - The current value of the input.
 * @param {string} [props.label] - The text for the input label.
 * @param {function} props.change - The onChange event handler.
 * @param {boolean} [props.animate] - Should the input display animated focus borders?
 * @param {boolean} [props.preventSpaces] - Should the input prevent spaces from being entered?
 * @param {number} [props.maxLength] - The maximum length of the input value.
 */
const Input = ({
  id,
  type = 'text',
  placeholder,
  name,
  value,
  label,
  change,
  animate,
  preventSpaces,
  maxLength,
}) => {
  const preventSpace = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  // Generate a fallback ID using the 'name' attribute if an 'id' isn't explicitly provided.
  // This guarantees the label's 'htmlFor' always has a matching input 'id'.
  const inputId = id || `input-${name}`;

  return (
    <div className="app-input-wrapper">
      {label ? (
        <label htmlFor={inputId} className="app-input-label">
          {label}
        </label>
      ) : /* 
          A11y Safety Net: If no visual label text is provided, 
          we inject an aria-label using the field's name so screen readers 
          aren't left stranded.
        */
      null}

      <div className={`app-input ${animate ? 'animate' : ''}`}>
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value ?? ''}
          onChange={change}
          onKeyDown={preventSpaces ? preventSpace : undefined}
          maxLength={maxLength}
          aria-label={!label ? name : undefined}
        />
        <span>
          <i></i>
        </span>
      </div>
    </div>
  );
};

export default Input;
