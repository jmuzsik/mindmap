import React, { useState, useEffect } from "react";
import { MenuDivider, Menu, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DnDContainer from "./DnD/DnD";
import NewNode from "../Nodes/NewNode";

import Dialog from "../../../Components/Dialog";

import { UserContext } from "../../utils";

import "./VerticalNav.css";

export default function VerticalNav({
  state: { isOpen, treeData, user, settings },
  hooks: { changeData },
}) {
  const [nodeOpen, setNodeOpen] = useState(false);
  const [forceOpen, setForcedOpen] = useState(undefined);
  const [showDnDCallout, setShowDnDCallout] = useState(false);
  let leftOpen = isOpen ? "open" : "closed";
  const names = treeData.names;

  useEffect(() => {
    if (user.step === 2) {
      setForcedOpen(true);
    } else if (user.step === 3) {
      setShowDnDCallout(true);
    }
  }, [user]);

  return (
    <div className={`vertical-nav ${leftOpen}`}>
      <UserContext.Consumer>
        {({ setUser }) => (
          <React.Fragment>
            <div className={`sidebar ${leftOpen}`}>
              <Menu className="content">
                <MenuDivider title={names.dnd} />
                <DnDContainer
                  state={{
                    treeData,
                    user,
                    settings,
                    showDnDCallout,
                  }}
                  hooks={{ changeData, setShowDnDCallout, setUser }}
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
                isOpen: nodeOpen || forceOpen,
                theme: settings.theme,
              }}
              hooks={{ setOpen: setNodeOpen }}
            >
              <NewNode
                state={{ names, forceOpen }}
                hooks={{
                  setOpen: setNodeOpen,
                  changeData,
                  setUser,
                  setForcedOpen,
                }}
              />
            </Dialog>
          </React.Fragment>
        )}
      </UserContext.Consumer>
    </div>
  );
}
