import React, { useState } from "react";
import { Dialog, Icon, Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function DialogWrapper(props) {
  const { className, icon, hook, title, children } = props;
  const customOpen = props.isOpen;
  const customHook = props.hook;
  const [isOpen, setOpen] = useState(false);
  return (
    <React.Fragment>
      <Button
        intent={Intent.PRIMARY}
        minimal
        onClick={() => (customHook ? customHook(true) : setOpen(true))}
      >
        Edit
      </Button>
      <Dialog
        {...props}
        className={className}
        icon={icon}
        onClose={() => hook(false)}
        title={title}
        autoFocus
        canEscapeKeyClose
        canOutsideClickClose={false}
        enforceFocus
        isOpen={customOpen ? customOpen : isOpen}
        usePortal
        labelElement={<Icon icon={IconNames.SHARE} />}
      >
        {children}
      </Dialog>
    </React.Fragment>
  );
}
