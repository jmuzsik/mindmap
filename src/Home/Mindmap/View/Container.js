import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableBox } from "./DraggableBox";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { useDeepEffect } from "../../../Utils/utils";
import db from "../../../db";

const styles = {
  border: "1px solid black",
  position: "relative",
};
function renderBox(item, key, state) {
  return <DraggableBox key={key} id={key} {...item} />;
}
export const Container = ({ snapToGrid, boxesContent, dimensions }) => {
  const [boxes, setBoxes] = useState(boxesContent);

  useDeepEffect(() => {
    setBoxes(boxesContent);
  }, [boxesContent]);

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
      if (snapToGrid) {
        [left, top] = doSnapToGrid(left, top);
      }

      moveBox(item.nodeId, left, top);
      return undefined;
    },
  });
  return (
    <div
      ref={drop}
      style={{
        ...styles,
        height: dimensions.height,
        width: dimensions.width,
      }}
    >
      {Object.keys(boxes).map((key) => renderBox(boxes[key], key))}
    </div>
  );
};
