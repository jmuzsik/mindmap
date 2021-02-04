import React from "react";
import { Dialog, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function DialogWrapper(props) {
  const { className, icon, setOpen, title, children, isOpen, user } = props;

  return (
    <Dialog
      {...props}
      className={className}
      icon={icon}
      onClose={() => setOpen(false)}
      title={title}
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose={false}
      enforceFocus
      isOpen={isOpen}
      usePortal
      portalClassName={user.theme === "dark" ? "bp3-dark" : ""}
      labelElement={<Icon icon={IconNames.SHARE} />}
    >
      {children}
    </Dialog>
  );
}
