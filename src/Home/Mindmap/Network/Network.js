import React, { useState } from "react";
import { useDeepEffect } from "../../../Utils";

import ResponsiveNetwork from "./Containers/ResponsiveNetwork";
import { createData } from "./utils";

import './Network.css';

// TODO: needs to be changed to this for updated node module

export default function Network({ treeData }) {
  const [data, setData] = useState([]);

  useDeepEffect(() => {
    setData(createData(treeData.structure, treeData.subject, treeData.data));
  }, [treeData.structure, treeData.subject, treeData.data]);
  return (
    <ResponsiveNetwork
      nodes={data.nodes}
      links={data.links}
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
