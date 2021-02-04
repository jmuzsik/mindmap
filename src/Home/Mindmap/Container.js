import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Network from "./Network/Network";

import { Container } from "./View/Container";

import { getItem } from "../../Settings";

import "./View/view.css";

export default function NetworkContainer({ treeData, changeData }) {
  return (
    <div
      className="network-container"
      style={{ height: treeData.dimensions.height }}
    >
      {getItem("view") === "network" ? (
        <Network treeData={treeData} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Container treeData={treeData} changeData={changeData} />
        </DndProvider>
      )}
    </div>
  );
}
