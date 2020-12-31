import React from "react";
import { Menu, MenuItem, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./VerticalNav.css";
import { goTo } from "../utils";

export default function VerticalNav(props) {
  return (
    <Menu className="vertical-nav">
      <MenuItem
        icon={IconNames.HOME}
        text="Home"
        onClick={() => goTo("/", props.history)}
      />
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
  );
}
