import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Resizable } from "re-resizable";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";

function getStyles(left, top, zIndex, { height, width }, isDragging) {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    height,
    width,
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
  const { id, content, left, top, nodeId, data, zIndex } = props;

  const [dimensions, setDimensions] = useState({
    width: data.width,
    height: data.height,
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.DRAG, id, left, top, content, dimensions, nodeId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    // <Resizable
    //   className="resizable"
    //   style={getStyles(left, top, zIndex, dimensions, isDragging)}
    //   size={{ width: dimensions.width, height: dimensions.height }}
    //   lockAspectRatio={data.file}
    //   onResizeStop={(e, direction, ref, d) => {
    //     console.log(d, dimensions);
    //     setDimensions({
    //       width: dimensions.width + d.width,
    //       height: dimensions.height + d.height,
    //     });
    //   }}
    // >
      <div
        ref={drag}
        // style={{ height: dimensions.height, width: dimensions.width }}
        style={getStyles(left, top, zIndex, dimensions, isDragging)}
      >
        {/* style={getStyles(left, top, zIndex, dimensions, isDragging)}> */}
        <Box
          style={{ height: dimensions.height, width: dimensions.width }}
          content={content}
        />
      </div>
    // </Resizable>
  );
};
