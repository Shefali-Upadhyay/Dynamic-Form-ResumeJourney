import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setField } from "../redux/formSlice";

export default function RadioGroup({ field, error, onFieldChange }) {
  const dispatch = useDispatch();
  const value = useSelector((s) => s.form.values[field.id] ?? "");

  const handleChange = (v) => {
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
      <div>
        {field.options?.map((opt) => (
          <label key={opt.value} style={{ display: "block" }}>
            <input
              type="radio"
              name={field.id}
              checked={value === opt.value}
              onChange={() => handleChange(opt.value)}
            />{" "}
            {opt.label}
          </label>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
