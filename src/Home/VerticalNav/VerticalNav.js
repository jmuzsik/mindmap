import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNote from "../Components/Notes/NewNote";
import NewImage from "../Components/Images/NewImage";

import Dialog from "../../Components/Dialog/Dialog";

import "./VerticalNav.css";

export default function VerticalNav(props) {
  const { isOpen, setOpen, user, changeData } = props;

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
          <MenuDivider title="DnD" />
          <DnDContainer {...{ ...props, setOpen }} />
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

      <Dialog
        {...{
          className: "new-note-dialog",
          icon: IconNames.ANNOTATION,
          setOpen: setNoteOpen,
          title: "New Note",
          isOpen: noteOpen,
        }}
      >
        <NewNote {...props} setOpen={setNoteOpen} changeData={changeData} />
      </Dialog>
      <Dialog
        {...{
          className: "new-image-dialog",
          icon: IconNames.IMAGE_ROTATE_LEFT,
          setOpen: setImageOpen,
          title: "New Image",
          isOpen: imageOpen,
        }}
      >
        <NewImage {...props} setOpen={setImageOpen} changeData={changeData} />
      </Dialog>
    </div>
  );
}
