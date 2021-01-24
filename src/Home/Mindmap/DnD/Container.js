import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Box } from "./Box";
import update from "immutability-helper";
const styles = {
  border: "1px solid black",
  position: "relative",
};

export default function Container({ treeData }) {
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 80, title: "Drag me around" },
    b: { top: 180, left: 20, title: "Drag me too" },
  });
  const [, drop] = useDrop({
    accept: "drag",
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveBox(item.id, left, top);
      return undefined;
    },
  });
  const moveBox = (id, left, top) => {
    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      })
    );
  };
  return (
    <div
      className="dnd-container"
      style={{
        ...styles,
        height: treeData.dimensions.height,
        width: treeData.dimensions.width,
      }}
      ref={drop}
    >
      {Object.keys(boxes).map((key) => {
        const { left, top, title } = boxes[key];
        return (
          <Box
            key={key}
            id={key}
            left={left}
            top={top}
          >
            {title}
          </Box>
        );
      })}
    </div>
  );
}
