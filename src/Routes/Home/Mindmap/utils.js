import React from "react";

import { Box } from "./DnD/Box";

import { InnerContent, handleStringCreation } from "../utils";

// 0 is main node, 1 is secondary, 3 is... etc
const colors = [
  "#2965CC",
  "#29A634",
  "#D99E0B",
  "#D13913",
  "#8F398F",
  "#00B3A4",
  "#DB2C6F",
  "#9BBF30",
  "#96622D",
  "#7157D9",
];

// TODO: this is not finished or is it?
const calcDistance = (depth) => (depth === 1 ? 100 : 30);

const pickColor = (type, depth) => {
  if (type === "l") {
    if (depth === 1) {
      return colors[2];
    }
    return colors[4];
  } else {
    if (depth === 1) {
      return colors[1];
    } else {
      return colors[3];
    }
  }
};

const createRadius = (depth) => (depth === 1 ? 10 : 5);

function createContent(props) {
  const { type, id, data, label, boxData } = props;
  return (
    <Box>
      <span className="treenode-id">{handleStringCreation(label, data)}</span>
      <InnerContent {...{ id, data, type }} />
    </Box>
  );
}

// https://stackoverflow.com/questions/35272533/flattening-deeply-nested-array-of-objects
function flatten(array) {
  let result = [];
  let parent = 0;
  let id = 1;
  let depth = 1;
  function inner(arr, p, i, d) {
    for (let j = 0; j < arr.length; j++) {
      const n = arr[j];
      // parent is the parent elements id
      n.parent = String(p);
      // i is either incremented from 0 (ie. 1, ...) (depth 1) or a key corresponding to
      // the parent (ie. 1.1, ..., 1.10, ...) - only 2 layers of depth
      if (d === 1) {
        // create id for mind map
        n.id = String(i);
        i++;
      } else {
        const key = p + "." + j;
        n.id = key;
      }
      // this is the depth of the node ( -0- node -> ( -1- node, node -> ( -2- node)))
      n.depth = d;
      result.push(n);
      if (Array.isArray(n.childNodes) && n.childNodes.length > 0) {
        // Parent is now id of current node (child nodes of current node accesses here)
        const check = result.concat(
          inner(n.childNodes, Number(n.id), i, d + 1)
        );
        if (check[check.length - 1] !== undefined) {
          result = check;
        }
      }
    }
  }
  inner(array, parent, id, depth);
  return result;
}

function createNodes(nodes, data, boxData) {
  const nodesWithData = nodes.map((n) => {
    const noteOrImage = n.type === "note" ? 0 : 1;
    const d = data[noteOrImage].find(({ _id }) => _id === n._id);
    return { ...n, data: d };
  });
  return nodesWithData.map(({ data, id, parent, depth, type }) => {
    return {
      jsx: createContent({
        type,
        id,
        data,
        boxData,
      }),
      depth,
      type,
      id,
      parent,
      color: pickColor("n", depth),
      radius: createRadius(depth),
      group: 0,
    };
  });
}

function createLinks(nodes) {
  return nodes.map(({ id, parent, depth }) => ({
    source: parent,
    target: id,
    distance: calcDistance(depth),
    color: pickColor("l", depth),
  }));
}

export function createData(tree, subject, data, boxData) {
  const nodes = flatten(tree[0].childNodes);
  return {
    nodes: [
      {
        jsx: <h1>{subject.name}</h1>,
        id: "0",
        type: "subject",
        depth: 0,
        radius: 20,
        color: colors[0],
      },
      ...createNodes(nodes, data, boxData),
    ],
    links: createLinks(nodes, data),
  };
}
