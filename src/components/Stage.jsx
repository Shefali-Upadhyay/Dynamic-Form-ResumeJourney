import React from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import RadioGroup from "./RadioGroup";
import SelfieCapture from "./SelfieCapture";

export default function Stage({ fields, errors, onFieldChange }) {
  return (
    <div>
      {fields.map((f) => {
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
