import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@blueprintjs/core";

import DnDContainer from "./DnD/Container";
import Network from "./Network";

export default function NetworkContainer({ treeData }) {
  const [networkOrDnD, setNetworkOrDnD] = useState("dnd");

  return (
    <div
      className="network-container"
      style={{
        height: treeData.dimensions.height,
        width: treeData.dimensions.width,
      }}
    >
      <Button
        onClick={() =>
          setNetworkOrDnD(networkOrDnD === "network" ? "dnd" : "network")
        }
      >
        Toggle
      </Button>
      {networkOrDnD === "network" ? (
        <Network treeData={treeData} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <DnDContainer treeData={treeData} />
        </DndProvider>
      )}
    </div>
  );
}
