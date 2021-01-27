import React, { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Button } from "@blueprintjs/core";

import Network from "./Network/Network";
import { createBoxesContent } from "./View/utils";
// import Container from "./View/DnDContainer";
import { CustomDragLayer } from "./View/CustomDragLayer";
import { Container } from "./View/Container";

import './View/view.css';


function ViewContainer({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

export default function NetworkContainer({ treeData, changeData }) {
  const [networkOrDnD, setNetworkOrDnD] = useState("dnd");

  const boxesContent = createBoxesContent({
    data: treeData.data,
    structure: treeData.structure,
    subject: treeData.subject,
    changeData,
    dimensions: treeData.dimensions,
  });

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
        <ViewContainer>
          <Container
            snapToGrid={false}
            boxesContent={boxesContent}
            dimensions={treeData.dimensions}
          />
          <CustomDragLayer snapToGrid={true} />
          {/* <View
            boxesContent={boxesContent}
            dimensions={treeData.dimensions}
            changeData={changeData}
          /> */}
        </ViewContainer>
      )}
    </div>
  );
}
