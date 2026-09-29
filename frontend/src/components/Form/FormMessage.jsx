function FormMessage({ children, type = "error" }) {
  if (!children) return null;

  return (
    <span className={`form-message form-message--${type}`}>
      {children}
    </span>
  );
}

export default FormMessage;