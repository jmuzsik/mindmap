import React from "react";
import {
  Popover,
  Tooltip,
  Classes,
  Position,
  Button,
  Intent,
} from "@blueprintjs/core";

import ResponsiveNetwork from "../Network/ResponsiveNetwork";
// TODO: needs to be changed to this for updated node module
// import {ResponsiveNetwork} from "@nivo/network";

const data = {
  nodes: [
    {
      id: "1",
      radius: 8,
      depth: 1,
      jsx: <div>hey mofo</div>,
      color: "rgb(97, 205, 187)",
    },
    {
      id: "0",
      radius: 12,
      depth: 0,
      jsx: <div>hey mofo number 2</div>,
      color: "rgb(244, 117, 96)",
    },
  ],
  links: [
    {
      source: "0",
      target: "1",
    },
  ],
};
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
