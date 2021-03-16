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

export const Container = ({
  state: { treeData, settings, user },
  changeData,
}) => {
  // Settings for dnd container
  const [border, setBorder] = useState(true);
  const [box, setBox] = useState(true);
  // amount of nodes + 1
  // zIndex increments whenever an object is moved for that object
  const [zIndex, setZIndex] = useState(
    user.zIndex + treeData.structure.childNodes.length + 1
  );
  const [boxes, setBoxes] = useState(
    createBoxesContent({
      data: treeData.data,
      structure: treeData.structure,
      subject: treeData.subject,
      dimensions: treeData.dimensions,
      user,
    })
  );

  useDeepEffect(() => {
    setBoxes(
      createBoxesContent({
        data: treeData.data,
        structure: treeData.structure,
        subject: treeData.subject,
        dimensions: treeData.dimensions,
        user,
      })
    );
  }, [
    treeData.data,
    treeData.structure,
    treeData.subject,
    changeData,
    treeData.dimensions,
  ]);

  const moveBox = (id, left, top, zIndex) => {
    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { left, top, zIndex },
        },
      })
    );
    setZIndex(zIndex + 1);
  };

  const [, drop] = useDrop({
    accept: ItemTypes.DRAG,
    drop(item, monitor) {
      const [type, id] = item.nodeId.split("-");
      const delta = monitor.getDifferenceFromInitialOffset();
      // not sure why it rarely happens to be NaN
      if (isNaN(item.left)) item.left = 0;
      if (isNaN(item.top)) item.top = 0;
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      // zIndex updated with state as to not have to await for db
      // for performance reasons
      db[type + "s"].update(Number(id), {
        x: left,
        y: top,
        zIndex: zIndex + 1,
      });
      db.user.update(user.id, { zIndex: zIndex + 1 });

      moveBox(item.nodeId, left, top, zIndex + 1);
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
