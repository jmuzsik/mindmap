import React from "react";
import {
  Navbar,
  Divider,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function skeleton() {
  return (
    <section className="bp3-skeleton layout">
      <header className="bp3-skeleton horizontal-nav bp3-skeleton">
        <Navbar className="bp3-skeleton">
          {" "}
          <Navbar.Group className="bp3-skeleton">
            <Navbar.Heading className="bp3-skeleton"></Navbar.Heading>
            <Divider className="bp3-skeleton" />
          </Navbar.Group>
          <Navbar.Group className="bp3-skeleton right-group"></Navbar.Group>
        </Navbar>
      </header>
      <main>
        <div className="vertical-nav open bp3-skeleton">
          <Button large />
          <div className="bp3-skeleton sidebar open">
            <div className="bp3-skeleton header">
              <Button
                className="bp3-skeleton sidebar-close"
                icon={IconNames.MENU_CLOSED}
                large
              />
            </div>
            <Menu className="bp3-skeleton content">
              <MenuDivider className="bp3-skeleton" title="DnD" />
              <MenuItem
                className="bp3-skeleton"
                icon={IconNames.ANNOTATION}
                text="New Content"
              />
            </Menu>
          </div>
        </div>
        <div className="network-container bp3-skeleton"></div>
      </main>
    </section>
  );
}
