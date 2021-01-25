import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

import { Box } from "./Box";
import { useDeepEffect } from "../../../Utils/utils";

const styles = {
  border: "1px solid black",
  position: "relative",
};

export default function Container({ boxesContent, dimensions }) {
  const [boxes, setBoxes] = useState(boxesContent);

  useDeepEffect(() => {
    setBoxes(boxesContent);
  }, [boxesContent]);

  const [, drop] = useDrop({
    accept: "drag",
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveBox(item.id, left, top, item.left);
      return undefined;
    },
  });
  const moveBox = (id, left, top) => {
    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { left, top, transform: null   },
        },
      })
    );
  };
  return (
    <div
      className="dnd-container"
      style={{
        ...styles,
        height: dimensions.height,
        width: dimensions.width,
      }}
      ref={drop}
    >
      {Object.keys(boxes).map((key) => {
        const { left, top, transform, zIndex, content } = boxes[key];
        return (
          <Box
            key={key}
            id={key}
            styles={{ left, top, zIndex, transform }}
            hideSourceOnDrag={true}
          >
            {content}
          </Box>
        );
      })}
    </div>
  );
}
