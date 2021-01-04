import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

export default ({content}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ name: "Dustbin" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }
  if (isActive) {
    console.log(canDrop, isOver)
  }
  return (
    <div ref={drop} className="map" style={{ backgroundColor }}>
      {isActive ? "Release to drop" : "Drag a box here"}
    </div>
  );
};
