import "./Input.css";

function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  helperText = "",
  disabled = false,
  required = false,
  id,
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        className={`input-field ${error ? "input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error || helperText ? `${inputId}-message` : undefined
        }
      />

      {(error || helperText) && (
        <span
          id={`${inputId}-message`}
          className={error ? "input-message error" : "input-message"}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
}

export default Input;