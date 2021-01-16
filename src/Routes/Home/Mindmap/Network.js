import React from "react";

import ResponsiveNetwork from "./Containers/ResponsiveNetwork";

// TODO: needs to be changed to this for updated node module

export default function Network({ data: { nodes, links }, history }) {
  return (
    <ResponsiveNetwork
      nodes={nodes}
      links={links}
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
