import "./Radio.css";

function Radio({
  id,
  name,
  value,
  checked,
  onChange,
  children,
  disabled = false,
  required = false,
  error = false,
  success = false,
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`radio ${error ? "error" : ""} ${
        success ? "success" : ""
      }`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={""}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />

      <span className="radio-circle"></span>

      <span className="radio-label">{children}</span>
    </label>
  );
}

export default Radio;