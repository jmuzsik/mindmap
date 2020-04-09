import React from "react";

import { Form, Input } from "antd";

export function FormInput(type, options) {
  const {
    name,
    placeholder,
    autoCorrect,
    autoCapitalize,
    autoFocus,
    required,
    value,
    hook,
    tabIndex
  } = options;
  function onChange(event) {
    hook(event.target.value);
  }
  return (
    <Form.Item>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        autoCorrect={autoCorrect || "off"}
        autoCapitalize={autoCapitalize || "off"}
        autoFocus={autoFocus || false}
        required={required || false}
        value={value}
        onChange={onChange}
        tabIndex={tabIndex}
      />
    </Form.Item>
  );
}
