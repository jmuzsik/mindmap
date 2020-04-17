import React from "react";
import { MenuItem, Menu } from "@blueprintjs/core";

import "./VerticalNav.css";

export default function VerticalNav() {
  return (
    <Menu className="vertical-nav">
      <MenuItem icon="annotation" text="Notes" />
      <MenuItem icon="media" text="Media" />
    </Menu>
  );
}
