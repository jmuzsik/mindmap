import React from "react";

import { Button, Intent, Spinner } from "@blueprintjs/core";

import "./Button.css";

export default function Button({ children, options, onClickFunc }) {
  return (
    <Button {...options} onClick={onClickFunc}>
      {children}
    </Button>
  );
}
