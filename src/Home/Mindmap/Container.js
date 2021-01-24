import React, { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Button } from "@blueprintjs/core";

import View from "./View/Container";
import Network from "./Network/Network";

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
      {/* <Network treeData={treeData} /> */}
      {networkOrDnD === "network" ? (
        <Network treeData={treeData} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <View treeData={treeData} />
        </DndProvider>
      )}
    </div>
  );
}
