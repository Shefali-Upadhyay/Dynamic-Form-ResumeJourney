import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setField } from "../redux/formSlice";

export default function TextInput({ field, error, onFieldChange }) {
  const dispatch = useDispatch();
  const value = useSelector((s) => s.form.values[field.id] ?? "");

  const handleChange = (e) => {
    const v = e.target.value;
    dispatch(setField({ id: field.id, value: v }));
    onFieldChange(field.id, v);
    try {
      const params = new URLSearchParams(window.location.search);
      const uid = params.get("userId");
      if (uid) {
        const stored = JSON.parse(
          localStorage.getItem(`formData-${uid}`) || "{}",
        );
        stored[field.id] = v;
        localStorage.setItem(`formData-${uid}`, JSON.stringify(stored));
      }
    } catch (e) {}
  };

  return (
    <div className="form-row">
      <label className="label">
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <input
        className="input"
        value={value}
        onChange={handleChange}
        type={field.inputType || "text"}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}
