import React from "react";
import "./Input.css";



function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = "",
  success = false,
}) {
  const messageId = `${name}-message`;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? "input-error" : ""} ${
          success ? "input-success" : ""
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error || success ? messageId : undefined}
      />

      {error && (
        <span id={messageId} className="input-message error-message">
          {error}
        </span>
      )}

      {!error && success && (
        <span id={messageId} className="input-message success-message">
          Campo preenchido corretamente.
        </span>
      )}
    </div>
  );
}

export default Input;