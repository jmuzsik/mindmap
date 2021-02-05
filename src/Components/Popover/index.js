import React from "react";
import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

export default function PopoverContainer({ children, names }) {
  return (
    <Popover2 placement="auto" content={children}>
      <Button minimal>{names.view}</Button>
    </Popover2>
  );
}
