import React, { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Switch, Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Network from "./Network/Network";

import { Container } from "./View/Container";

import { UserContext } from "../../App";

import "./View/view.css";

export default function NetworkContainer({ treeData, changeData }) {
  const [border, setBorder] = useState(true);
  const [box, setBox] = useState(true);
  return (
    <div
      className="network-container"
      style={{ height: treeData.dimensions.height }}
    >
      <Popover2
        content={
          <div className="network-settings">
            <Switch
              checked={border}
              label="Border"
              onChange={() => setBorder(!border)}
            />
            <Switch checked={box} label="Box" onChange={() => setBox(!box)} />
          </div>
        }
      >
        <Button icon="cog" />
      </Popover2>
      <UserContext.Consumer>
        {(userObj) =>
          userObj.user.view === "network" ? (
            <Network treeData={treeData} />
          ) : (
            <DndProvider backend={HTML5Backend}>
              <Container
                border={border}
                treeData={treeData}
                changeData={changeData}
              />
            </DndProvider>
          )
        }
      </UserContext.Consumer>
    </div>
  );
}
