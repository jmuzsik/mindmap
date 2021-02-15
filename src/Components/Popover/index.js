import React from "react";
import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

export default function PopoverContainer({ children, names, className }) {
  return (
    <Popover2 placement="auto" content={children} popoverClassName={className}>
      <Button minimal>{names.view}</Button>
    </Popover2>
  );
}
