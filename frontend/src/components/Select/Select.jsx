
import React from "react";
import "./Select.css";

function Select({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  children,
  disabled = false,
  error = "",
  success = false,
}) {
  const campoId = id || name;
  const messageId = `${name}-message`;

  return (
    <div className="select-group">
      {label && (
        <label htmlFor={campoId} className="select-label">
          {label}
        </label>
      )}

      <select
        id={campoId}
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
        {children || (
          <>
            <option value="">Selecione uma opção</option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </>
        )}
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
