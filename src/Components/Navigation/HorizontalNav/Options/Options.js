import React from "react";
import {
  Popover,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
} from "@blueprintjs/core";

export default function Options({ userId, onLogout, setAuthInfo }) {
  return (
    <Popover
      popoverClassName="options-popover"
      portalClassName="options-popover-portal"
      position="auto"
      enforceFocus={false}
    >
      <Button icon="caret-down" />
      <Menu>
        <MenuItem text="Subject Settings" />
        <MenuItem text="Account Settings" />
        <MenuDivider />
        <MenuItem
          icon="log-out"
          text="Log out"
          onClick={() => onLogout(setAuthInfo)}
        />
      </Menu>
    </Popover>
  );
}
