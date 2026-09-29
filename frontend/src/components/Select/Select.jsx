import "./Select.css";
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
  return (
    <div className="select-group">
      {label && <label htmlFor={name}>{label}</label>}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          select
          ${error ? "select-error" : ""}
          ${success ? "select-success" : ""}
        `}
        aria-invalid={!!error}
      >
        <option value="">Selecione uma opção</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="select-message error-message">
          {error}
        </span>
      )}

      {!error && success && (
        <span className="select-message success-message">
          Campo preenchido corretamente.
        </span>
      )}
    </div>
  );
}

export default Select;