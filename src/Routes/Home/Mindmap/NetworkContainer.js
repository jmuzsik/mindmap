import React, { useState } from "react";
import { useDeepEffect } from "../../../Utils/utils";

import Network from "./Network";

import { createData } from "./utils";

export default function NetworkContainer({ treeData, history }) {
  const [data, setData] = useState([]);

  // with ref
  useDeepEffect(() => {
    setData(createData(treeData.structure, treeData.subject, treeData.data));
  }, [treeData.structure, treeData.subject, treeData.data]);

  return (
    <div
      className="network-container"
      style={{
        height: treeData.dimensions.height,
        width: treeData.dimensions.width,
      }}
    >
      <Network history={history} data={data} />
    </div>
  );
}
