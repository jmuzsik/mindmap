import React from "react";
import { Dialog, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function DialogWrapper({
  state: { className, icon, title, isOpen, theme },
  hooks: { setOpen },
  children,
}) {
  return (
    <Dialog
      portalClassName={theme}
      className={className}
      icon={icon}
      onClose={() => setOpen(false)}
      title={title}
      canOutsideClickClose={false}
      isOpen={isOpen}
      labelElement={<Icon icon={IconNames.SHARE} />}
    >
      {children}
    </Dialog>
  );
}
