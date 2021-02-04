import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNode from "../Nodes/NewNode";

import Dialog from "../../Components/Dialog/Dialog";

import "./VerticalNav.css";
import { UserContext } from "../../App";

export default function VerticalNav(props) {
  const { isOpen, setOpen, changeData, treeData } = props;

  const [nodeOpen, setNodeOpen] = useState(false);
  let leftOpen = isOpen ? "open" : "closed";

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <div className={`vertical-nav ${leftOpen}`}>
          <div className={`sidebar ${leftOpen}`}>
            <Menu className="content">
              <MenuDivider title={treeData.names.dnd} />
              <DnDContainer {...{ ...props, setOpen }} />
              <MenuItem
                icon={IconNames.ANNOTATION}
                text={`${treeData.names.create} ${treeData.names.content}`}
                onClick={() => setNodeOpen(true)}
              />
            </Menu>
          </div>
          {/* <Dialog
            {...{
              className: "new-node-dialog",
              icon: IconNames.ANNOTATION,
              title: `${treeData.names.create} ${treeData.names.content}`,
              setOpen: setNodeOpen,
              isOpen: nodeOpen,
              user,
            }}
          >
            <NewNode
              {...props}
              setOpen={setNodeOpen}
              changeData={changeData}
              names={treeData.names}
            />
          </Dialog> */}
        </div>
      )}
    </UserContext.Consumer>
  );
}
