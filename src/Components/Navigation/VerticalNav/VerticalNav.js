import React, { useState } from "react";
import {
  MenuDivider,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Icon,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./VerticalNav.css";
import Home from "../../../Routes/Home/Home";
import NewNote from "../../../Routes/Notes/NewNote";
import NewImage from "../../../Routes/Images/NewImage";

function DialogWrapper(props) {
  const { className, icon, hook, title, isOpen, children } = props;
  return (
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
      isOpen={isOpen}
      usePortal
      labelElement={<Icon icon={IconNames.SHARE} />}
    >
      {children}
    </Dialog>
  );
}

export default function VerticalNav(props) {
  const { isOpen, setOpen, changeData } = props;

  const [noteOpen, setNoteOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  let leftOpen = isOpen ? "open" : "closed";
  return (
    <div className={`vertical-nav ${leftOpen}`}>
      <Button
        className="sidebar-open"
        onClick={() => setOpen(!isOpen)}
        icon={IconNames.MENU_OPEN}
        large
      />
      <div className={`sidebar ${leftOpen}`}>
        <div className="header">
          <Button
            className="sidebar-close"
            onClick={() => setOpen(!isOpen)}
            icon={IconNames.MENU_CLOSED}
            large
          />
        </div>
        <Menu className="content">
          <MenuDivider title="Edit" />
          <Home {...{ ...props, setOpen }} />
          <MenuItem
            icon={IconNames.ANNOTATION}
            text="New Note"
            onClick={() => setNoteOpen(true)}
          />
          <MenuItem
            icon={IconNames.IMAGE_ROTATE_LEFT}
            text="New Image"
            onClick={() => setImageOpen(true)}
          />
        </Menu>
      </div>
      <DialogWrapper
        {...{
          className: "new-note-dialog",
          icon: IconNames.ANNOTATION,
          hook: setNoteOpen,
          title: "New Note",
          isOpen: noteOpen,
        }}
      >
        <NewNote {...props} setOpen={setNoteOpen} changeData={changeData} />
      </DialogWrapper>
      <DialogWrapper
        {...{
          className: "new-image-dialog",
          icon: IconNames.IMAGE_ROTATE_LEFT,
          hook: setImageOpen,
          title: "New Image",
          isOpen: imageOpen,
        }}
      >
        <NewImage {...props} setOpen={setImageOpen} changeData={changeData} />
      </DialogWrapper>
    </div>
  );
}
