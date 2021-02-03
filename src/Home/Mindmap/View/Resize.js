import React from "react";
import { Resizable } from "re-resizable";

import db from "../../../db";

function updateInDb(nodeId, { height, width }) {
  const [type, strId] = nodeId.split("-");
  // id needs to be number for query
  const id = Number(strId);
  db[type + "s"].update(id, { height, width });
}

export const Resize = (props) => {
  const { nodeId, dimensions, setDimensions, children, border, zIndex } = props;

  const style = {
    position: "absolute",
    border: border && "1px dashed gray",
    cursor: "move",
    left: props.left,
    top: props.top,
    transform: "translate3d(0, 0, 0)",
    zIndex,
    // height: props.dimensions.height,
    // width: props.dimensions.width,
  };

  return (
    <Resizable
      className="resizable"
      style={style}
      lockAspectRatio
      size={{ width: dimensions.width, height: dimensions.height }}
      onResizeStop={(e, direction, ref, d) => {
        const width = dimensions.width + d.width;
        const height = dimensions.height + d.height;
        // Asynchronous but slows down the rendering quite a bit if awaited on
        updateInDb(nodeId, { width, height });
        setDimensions({
          width,
          height,
        });
      }}
    >
      {children}
    </Resizable>
  );
};
