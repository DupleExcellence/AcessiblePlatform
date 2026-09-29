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
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          input
          ${error ? "input-error" : ""}
          ${success ? "input-success" : ""}
        `}
        aria-invalid={!!error}
      />

      {error && <span className="input-message error-message">{error}</span>}

      {!error && success && (
        <span className="input-message success-message">
          Campo preenchido corretamente.
        </span>
      )}
    </div>
  );
}

export default Input;