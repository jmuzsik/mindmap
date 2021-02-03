import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

export default function PopoverContainer({ type, id, children, names }) {
  return (
    <Popover2
      autoFocus
      placement="bottom-end" 
      content={children}
    >
      <Button intent={Intent.PRIMARY} minimal>
        {names.view}
      </Button>
    </Popover2>
  );
}
