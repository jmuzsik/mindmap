import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

import { Box } from "./Box";

const styles = {
  border: "1px solid black",
  position: "relative",
};

function calculateLocation(node, center) {
  if (center) {
    return;
  }
}

export default function Container({ treeData }) {
  const [boxes, setBoxes] = useState({
    // TODO: This must be changed 
    a: { left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)", title: "Drag me around" },
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
        const { left, top, transform, title } = boxes[key];
        return (
          <Box
            key={key}
            id={key}
            left={left}
            top={top}
            transform={transform}
            hideSourceOnDrag={true}
          >
            {title}
          </Box>
        );
      })}
    </div>
  );
}
