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
  const { nodeId, data, styles, dimensions, setDimensions, children } = props;

  return (
    <Resizable
      className="resizable"
      style={styles}
      size={{ width: dimensions.width, height: dimensions.height }}
      lockAspectRatio={data.file}
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
