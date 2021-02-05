import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Resize } from "./Resize";
import { ItemTypes } from "./ItemTypes";

export const DraggableBox = (props) => {
  const { id, content, left, top, nodeId, data, zIndex, border } = props;

  const [dimensions, setDimensions] = useState({
    width: data.aspectRatio && data.width + 30,
    // ie. if 2:1/width=70 (width:height) then (100:50), etc.
    // aspect ratio is a double (calculated through width / height)
    height: data.aspectRatio && (data.width + 30) / data.aspectRatio,
  });

  const [{ isDragging }, drag] = useDrag({
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const styles = {
    height: dimensions.height,
    width: dimensions.width,
    transform: "translate3d(0, 0, 0)",
  };
  if (isDragging) {
    return <div ref={drag} />;
  }
  return (
    <Resize
      {...{
        nodeId,
        data,
        styles,
        left,
        top,
        dimensions,
        setDimensions,
        border,
        zIndex,
      }}
    >
      <div className="drag" ref={drag} style={styles}>
        <div className="dnd-box">{content}</div>
      </div>
    </Resize>
  );
};
