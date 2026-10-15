import React from "react";
import "./Select.css";

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  error = "",
  success = false,
}) {
  const messageId = `${name}-message`;

  return (
    <div className="select-group">
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`select ${error ? "select-error" : ""} ${
          success ? "select-success" : ""
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error || success ? messageId : undefined}
      >
        <option value="">Selecione uma opção</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span id={messageId} className="select-message error-message">
          {error}
        </span>
      )}

      {!error && success && (
        <span id={messageId} className="select-message success-message">
          Campo preenchido corretamente.
        </span>
      )}
    </div>
  );
}

export default Select;