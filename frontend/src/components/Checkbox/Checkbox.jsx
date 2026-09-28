import "./Checkbox.css";

function Checkbox({
  id,
  name,
  value,
  checked,
  onChange,
  children,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <label htmlFor={id} className="checkbox">
      <input
        id={id}
        name={name}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />

      <span className="checkbox-box"></span>

      <span className="checkbox-label">{children}</span>
    </label>
  );
}

export default Checkbox;