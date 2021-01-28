import React, { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Radio, RadioGroup, Switch } from "@blueprintjs/core";

import Network from "./Network/Network";
import { createBoxesContent } from "./View/utils";
// import Container from "./View/DnDContainer";
import { CustomDragLayer } from "./View/CustomDragLayer";
import { Container } from "./View/Container";

import "./View/view.css";

function ViewContainer({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

export default function NetworkContainer({ treeData, changeData }) {
  const [networkOrDnD, setNetworkOrDnD] = useState("dnd");
  const [border, setBorder] = useState(true);

  return (
    <div
      className="network-container"
      style={{
        height: treeData.dimensions.height,
        width: treeData.dimensions.width,
      }}
    >
      <RadioGroup
        label="View"
        onChange={() => setNetworkOrDnD(
          networkOrDnD === "network" ? "dnd" : "network"
        )}
        selectedValue={networkOrDnD}
      >
        <Radio label="Network" value="network" />
        <Radio label="DnD" value="dnd" />
      </RadioGroup>
      <Switch
        checked={border}
        label="Border"
        onChange={() => setBorder(!border)}
      />
      {/* <Network treeData={treeData} /> */}
      {networkOrDnD === "network" ? (
        <Network treeData={treeData} />
      ) : (
        <ViewContainer>
          <Container
            border={border}
            treeData={treeData}
            changeData={changeData}
          />
          <CustomDragLayer border={border} />
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
