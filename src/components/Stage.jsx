import React from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import RadioGroup from "./RadioGroup";
import SelfieCapture from "./SelfieCapture";

export default function Stage({ fields, errors, onFieldChange }) {
  return (
    <div>
      {fields.map((f, i) => {
        // 👇 Combine Country Code + Phone Number in one row
        if (f.id === "phoneCountry") {
          const next = fields[i + 1];
          if (next?.id === "number") {
            return (
              <div key="phone-row" className="phone-row">
                <SelectInput
                  field={f}
                  error={errors[f.id]}
                  onFieldChange={onFieldChange}
                />
                <TextInput
                  field={next}
                  error={errors[next.id]}
                  onFieldChange={onFieldChange}
                />
              </div>
            );
          }
        }
        if (f.id === "number") return null; // skip duplicate render

        const props = { field: f, error: errors[f.id], onFieldChange };
        switch (f.componentType) {
          case "input":
            return <TextInput key={f.id} {...props} />;
          case "textarea":
            return <TextArea key={f.id} {...props} />;
          case "select":
            return <SelectInput key={f.id} {...props} />;
          case "radio":
            return <RadioGroup key={f.id} {...props} />;
          case "selfie":
            return <SelfieCapture key={f.id} {...props} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
