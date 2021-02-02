import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNode from "../Nodes/NewNode";

import Dialog from "../../Components/Dialog/Dialog";

import "./VerticalNav.css";

export default function VerticalNav(props) {
  const { isOpen, setOpen, changeData } = props;

  const [nodeOpen, setNodeOpen] = useState(false);
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
            text="New Content"
            onClick={() => setNodeOpen(true)}
          />
        </Menu>
      </div>
      <Dialog
        {...{
          className: "new-node-dialog",
          icon: IconNames.ANNOTATION,
          setOpen: setNodeOpen,
          title: "New Content",
          isOpen: nodeOpen,
        }}
      >
        <NewNode {...props} setOpen={setNodeOpen} changeData={changeData} />
      </Dialog>
    </div>
  );
}
