import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Resize } from "./Resize";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";

function getStyles(left, top, zIndex, { height, width }, border, isDragging) {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    height,
    width,
    border: border ? "1px solid #ddd" : "none",
    // right,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    objectFit: "fill",
    // height: isDragging ? 0 : "",
    zIndex,
  };
}

export const DraggableBox = (props) => {
  const { id, content, left, top, nodeId, data, zIndex, border } = props;

  const [dimensions, setDimensions] = useState({
    width: data.width && data.width + 30,
    height: data.height && data.height + 30,
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.DRAG,
      id,
      left,
      top,
      content,
      dimensions,
      nodeId,
      zIndex,
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const styles = getStyles(left, top, zIndex, dimensions, border, isDragging);
  return (
    <Resize
      {...{ nodeId, data, styles, dimensions, setDimensions }}
      style={styles}
    >
      <div className="drag" ref={drag}>
        <Box content={content} />
      </div>
    </Resize>
  );
};
