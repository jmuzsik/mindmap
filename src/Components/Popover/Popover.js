import React from "react";
import { Button, Intent, Popover } from "@blueprintjs/core";

const truncate = (s = "") => s.slice(0, 7);

export default function PopoverContainer({ type, id, children }) {
  return (
    <Popover
      popoverClassName={`${type}-${truncate(id)}-popover`}
      portalClassName={`${type}-${truncate(id)}-portal`}
    >
      <Button intent={Intent.PRIMARY} minimal>
        View
      </Button>
      {children}
    </Popover>
  );
}
