import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

export const Dustbin = ({ content, name }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ name: "Dustbin" }),
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
  if (isActive) {
    // console.log(canDrop, isOver)
  }
  return (
    <div ref={drop} className="map" style={{ backgroundColor }}>
      {content}
    </div>
  );
};
