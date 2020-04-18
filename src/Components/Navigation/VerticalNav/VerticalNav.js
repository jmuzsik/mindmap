import React from "react";
import { MenuItem, Menu } from "@blueprintjs/core";

import "./VerticalNav.css";

function goTo(place, goTo) {
  console.log(goTo)
  return goTo.push(place);
}

export default function VerticalNav({ history }) {
  return (
    <Menu className="vertical-nav">
      <MenuItem
        icon="annotation"
        text="Notes"
        onClick={() => goTo("/notes", history)}
      />
      <MenuItem icon="media" text="Media" />
    </Menu>
  );
}
