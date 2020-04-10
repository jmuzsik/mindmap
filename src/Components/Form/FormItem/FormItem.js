import React from "react";
import {
  FormGroup,
  InputGroup,
  Intent,
  Tooltip,
  Button,
} from "@blueprintjs/core";

import "./FormItem.css";

function createLockButton({ showPassword, toggleShowPassword }) {
  return (
    <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal={true}
        onClick={() => toggleShowPassword(!showPassword)}
      />
    </Tooltip>
  );
}

function checkType(name, passwordObj) {
  if (passwordObj) {
    return passwordObj.showPassword ? "text" : "password";
  }
  return name;
}

export default function FormItem({
  name,
  placeholder,
  autoCorrect,
  autoCapitalize,
  autoFocus,
  required,
  value,
  hook,
  passwordObj,
}) {
  function onChange(event) {
    hook(event.target.value);
  }
  return (
    <FormGroup>
      <InputGroup
        type={checkType(name, passwordObj)}
        name={name}
        placeholder={placeholder}
        autoCorrect={autoCorrect || "off"}
        autoCapitalize={autoCapitalize || "off"}
        autoFocus={autoFocus || false}
        required={required || false}
        value={value}
        onChange={onChange}
        rightElement={passwordObj ? createLockButton(passwordObj) : null}
      />
    </FormGroup>
  );
}
