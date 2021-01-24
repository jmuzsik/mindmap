import React from "react";
import { useDrag } from "react-dnd";

const style = {
  position: "absolute",
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
  margin: "auto",
};
export const Box = ({ id, left, top, transform, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, type: "drag" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div ref={drag} style={{ ...style, left, top, transform }}>
      {children}
    </div>
  );
};
