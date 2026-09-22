import "./Button.css";

function Button({
  children,
  onClick,
  variant = "primary",
}) {
  return (
    <button
      onClick={onClick}
      className={`button ${variant}`}
    >
      {children}
    </button>
  );
}

export default Button;