import "./Button.css";

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`button ${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;