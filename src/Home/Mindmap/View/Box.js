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
export const Box = ({ id, nodeId, styles, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      id,
      left: styles.left,
      top: styles.top,
      nodeId,
      type: "drag",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div ref={drag} style={{ ...style, ...styles }} className="box-go">
      {children}
    </div>
  );
};
