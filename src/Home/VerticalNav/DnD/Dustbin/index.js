import React from "react";
import { useDrop } from "react-dnd";

export const Dustbin = ({ content, name }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "box",
    drop: () => ({ name }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = "rgba(0, 0, 0, 0)";
  if (isActive) {
    backgroundColor = "#137cbd";
  } else if (canDrop) {
    backgroundColor = "rgba(191, 204, 214, 0.4)";
  }
  return (
    <div ref={drop} style={{ backgroundColor }}>
      {content}
    </div>
  );
};
