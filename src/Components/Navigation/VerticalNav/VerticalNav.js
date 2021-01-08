import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./VerticalNav.css";
import { goTo } from "../utils";
import Home from "../../../Routes/Home/Home";

export default function VerticalNav(props) {
  const { isOpen, setOpen } = props;
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
            text="Notes"
            onClick={() => goTo("/notes", props.history)}
          />
          <MenuItem
            icon={IconNames.IMAGE_ROTATE_LEFT}
            text="Images"
            onClick={() => goTo("/images", props.history)}
          />
        </Menu>
      </div>
    </div>
  );
}
