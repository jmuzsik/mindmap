import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Network from "./Network/Network";

import { Container } from "./View/Container";

import "./View/view.css";

export default function NetworkContainer({
  state: { treeData, settings, user },
  changeData,
}) {
  return (
    <div
      className="network-container"
      style={{ height: treeData.dimensions.height }}
    >
      {settings.view === "network" ? (
        <Network treeData={treeData} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Container
            state={{ treeData, settings, user }}
            changeData={changeData}
          />
        </DndProvider>
      )}
    </div>
  );
}
