import React, { useState, useEffect } from "react";
import { MenuDivider, Menu, MenuItem, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNote from "../Components/Notes/NewNote";
import NewImage from "../Components/Images/NewImage";

import Dialog from "../../../Components/Dialog/Dialog";

import { createCallout } from "./utils";

import "./VerticalNav.css";

export default function VerticalNav(props) {
  const { isOpen, setOpen, changeData } = props;

  const [noteOpen, setNoteOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [callout, setCallout] = useState(null);
  let leftOpen = isOpen ? "open" : "closed";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.treeData.subject._id === null) {
        setCallout(createCallout());
      } else {
        setCallout(null);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [props.treeData.subject._id]);

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
        {callout ? (
          callout
        ) : (
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
        )}
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
