import React from "react";

import "./Textarea.css";

function Textarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  required = false,
  error = false,
  success = false,
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`textarea ${error ? "error" : ""} ${
        success ? "success" : ""
      }`}
      {...props}
    />
  );
}

export default Textarea;