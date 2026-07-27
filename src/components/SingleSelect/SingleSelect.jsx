import React from 'react';
import './SingleSelect.scss';

/**
 * A reusable select dropdown component with an optional label.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.id] - The unique ID of the select.
 * @param {string} props.name - The name of the select.
 * @param {string} props.value - The current selected value.
 * @param {string} [props.label] - The text for the select label.
 * @param {string[]} props.options - Array of dropdown options.
 * @param {function} props.change - The onChange event handler.
 */
const SingleSelect = ({ id, name, value, label, options, change }) => {
  // Generate fallback ID using name if one isn't provided
  const selectId = id || `select-${name}`;

  return (
    <div className="app-select-wrapper">
      {label ? (
        <label htmlFor={selectId} className="app-input-label">
          {label}
        </label>
      ) : null}

      <div className="app-select">
        <select
          id={selectId}
          name={name}
          value={value ?? ''}
          onChange={change}
          aria-label={!label ? name : undefined}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span>
          <i></i>
        </span>
      </div>
    </div>
  );
};

export default SingleSelect;
