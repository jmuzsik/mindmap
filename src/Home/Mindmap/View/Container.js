import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableBox } from "./DraggableBox";
import update from "immutability-helper";
import { createBoxesContent } from "./utils";

import { useDeepEffect } from "../../../Utils";
import db from "../../../db";

const styles = {
  border: "1px solid black",
  position: "relative",
};
function renderBox(item, key, border) {
  return <DraggableBox key={key} id={key} {...item} border={border} />;
}
export const Container = ({ treeData, changeData, border }) => {
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

  const moveBox = useCallback(
    (id, left, top) => {
      console.log(id);
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [boxes]
  );
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
      ref={drop}
      style={{
        ...styles,
        height: treeData.dimensions.height,
        width: treeData.dimensions.width,
      }}
    >
      {Object.keys(boxes).map((key) => renderBox(boxes[key], key, border))}
    </div>
  );
};
