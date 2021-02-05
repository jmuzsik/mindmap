import React, { useState } from "react";

import { useDeepEffect } from "../../../../Hooks";

import ResponsiveNetwork from "./Containers/ResponsiveNetwork";
import { createData } from "./utils";

import "./Network.css";

export default function Network({ treeData: { structure, subject, data } }) {
  const [networkData, setData] = useState([]);

  useDeepEffect(() => {
    setData(createData(structure, subject, data));
  }, [structure, subject, data]);

  return (
    <ResponsiveNetwork
      nodes={networkData.nodes}
      links={networkData.links}
      nodeColor={function (e) {
        return e.color;
      }}
      linkThickness={function (e) {
        return 2 * (2 - e.source.depth);
      }}
      linkDistance={(link) => link.distance}
      motionStiffness={160}
    />
  );
}
