import "./Select.css";

function Select({
  id,
  name,
  value,
  onChange,
  children,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="select"
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;