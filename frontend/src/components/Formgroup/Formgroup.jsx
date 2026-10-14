import React from "react";
import "./Formgroup.css";

function FormGroup({ label, children }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-group__label">
          {label}
        </label>
      )}

      {children}
    </div>
  );
}

export default FormGroup;