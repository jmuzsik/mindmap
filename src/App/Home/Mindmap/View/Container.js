import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Switch, Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import update from "immutability-helper";

import { ItemTypes } from "./ItemTypes";
import { DraggableBox } from "./DraggableBox";
import { createBoxesContent } from "./utils";

import { useDeepEffect } from "../../../../Hooks";

import db from "../../../../db";

const createStyles = (border, theme) => ({
  border: border
    ? `1px solid ${theme === "bp3-dark" ? "white" : "black"}`
    : "none",
  position: "relative",
});

function renderBox(item, key, border) {
  return <DraggableBox key={key} id={key} {...item} border={border} />;
}

export const Container = ({ state: { treeData, settings }, changeData }) => {
  // Settings for dnd container
  const [border, setBorder] = useState(true);
  const [box, setBox] = useState(true);
  const [boxes, setBoxes] = useState(
    createBoxesContent({
      data: treeData.data,
      structure: treeData.structure,
      subject: treeData.subject,
      changeData,
      dimensions: treeData.dimensions,
    })
  );

  useDeepEffect(() => {
    setBoxes(
      createBoxesContent({
        data: treeData.data,
        structure: treeData.structure,
        subject: treeData.subject,
        changeData,
        dimensions: treeData.dimensions,
      })
    );
  }, [
    treeData.data,
    treeData.structure,
    treeData.subject,
    changeData,
    treeData.dimensions,
  ]);

  const moveBox = (id, left, top) => {
    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      })
    );
  };

  const [, drop] = useDrop({
    accept: ItemTypes.DRAG,
    drop(item, monitor) {
      const [type, id] = item.nodeId.split("-");
      const delta = monitor.getDifferenceFromInitialOffset();
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      db[type + "s"].update(Number(id), {
        x: left,
        y: top,
      });

      moveBox(item.nodeId, left, top);
      return undefined;
    },
  });

  return (
    <div
      className="drag-container"
      ref={drop}
      style={{
        ...createStyles(box, settings.theme),
        height: treeData.dimensions.height,
      }}
    >
      <Popover2
        className="dnd-settings-target"
        portalClassName={settings.theme}
        content={
          <div className="dnd-settings">
            <Switch
              checked={border}
              label="Border"
              onChange={() => setBorder(!border)}
            />
            <Switch checked={box} label="Box" onChange={() => setBox(!box)} />
          </div>
        }
      >
        <Button icon="cog" className="dnd-settings-button" />
      </Popover2>
      {Object.keys(boxes).map((key) => renderBox(boxes[key], key, border))}
    </div>
  );
};