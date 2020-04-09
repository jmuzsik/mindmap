import React from "react";
import { Form, Input } from "antd";

import "./FormItem.css";

const { Item } = Form;

export default function FormItem({
  name,
  placeholder,
  autoCorrect,
  autoCapitalize,
  autoFocus,
  required,
  value,
  hook,
  tabIndex,
  focus,
}) {
  function onChange(event) {
    hook(event.target.value);
  }
  return (
    <Item>
      <Input
        type={name}
        name={name}
        placeholder={placeholder}
        autoCorrect={autoCorrect || "off"}
        autoCapitalize={autoCapitalize || "off"}
        autoFocus={autoFocus || false}
        required={required || false}
        value={value}
        onChange={onChange}
        tabIndex={tabIndex}
        onFocus={() => focus && focus()}
      />
    </Item>
  );
}
