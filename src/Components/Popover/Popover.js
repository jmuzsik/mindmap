import React from "react";
import { Button, Intent, Popover } from "@blueprintjs/core";

export default function PopoverContainer({ type, id, children }) {
  return (
    <Popover
      popoverClassName={`${type}-${id}-popover`}
      portalClassName={`${type}-${id}-portal`}
    >
      <Button intent={Intent.PRIMARY} minimal>
        View
      </Button>
      {children}
    </Popover>
  );
}
