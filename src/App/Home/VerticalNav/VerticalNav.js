import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNode from "../Nodes/NewNode";

import Dialog from "../../../Components/Dialog";

import "./VerticalNav.css";

export default function VerticalNav({
  state: { isOpen, treeData, user, settings },
  hooks: { changeData },
}) {
  const [nodeOpen, setNodeOpen] = useState(false);
  let leftOpen = isOpen ? "open" : "closed";
  const names = treeData.names;

  return (
    <div className={`vertical-nav ${leftOpen}`}>
      <div className={`sidebar ${leftOpen}`}>
        <Menu className="content">
          <MenuDivider title={names.dnd} />
          <DnDContainer
            state={{
              treeData,
              user,
              settings,
            }}
            hooks={{ changeData }}
          />
          <MenuItem
            icon={IconNames.ANNOTATION}
            text={`${names.create} ${names.content}`}
            onClick={() => setNodeOpen(true)}
          />
        </Menu>
      </div>
      <Dialog
        state={{
          className: "new-node-dialog",
          icon: IconNames.ANNOTATION,
          title: `${names.create} ${names.content}`,
          isOpen: nodeOpen,
          theme: settings.theme,
        }}
        hooks={{ setOpen: setNodeOpen }}
      >
        <NewNode
          state={{ names, editor: settings.editor }}
          hooks={{ setOpen: setNodeOpen, changeData }}
        />
      </Dialog>
    </div>
  );
}
