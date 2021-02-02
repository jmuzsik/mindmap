import React from "react";

import Editor from "../../../Components/Editor";
import { InnerContent } from "../../utils";

// 0 is main node, 1 is secondary, 3 is... etc
const colors = [
  "#FFC940",
  "#D1F26D",
  "#AD99FF",
  "#FF6E4A",
  "#C274C2",
  "#A6BB65",
  "#99AF55",
  "#8CA345",
  "#7F9835",
  "#728C23",
];

// TODO: this is not finished or is it?
const calcDistance = (depth) => (depth === 1 ? 120 : 60);

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

const createRadius = (depth) => (depth === 1 ? 20 : 15);

function createContent({ data }) {
  return (
    <div className="treenode-content">
      <InnerContent data={data} />
    </div>
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
      n.dataId = Number(n.id);
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

function createNodes(nodes, data) {
  const nodesWithData = nodes.map((n) => {
    const d = data.find(({ id }) => id === n.dataId);
    return { ...n, data: d };
  });
  return nodesWithData.map(({ data, id, parent, depth }) => {
    return {
      jsx: createContent({
        id,
        data,
      }),
      depth,
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

export function createData(tree, subject, data) {
  const treeCopy = JSON.parse(JSON.stringify(tree));
  const nodes = flatten(treeCopy.childNodes);
  return {
    nodes: [
      {
        jsx: (
          <Editor
            contentEditable={false}
            readOnly={true}
            editorState={subject.content}
            setEditorState={() => null}
            theme="bubble"
          />
        ),
        id: "0",
        type: "subject",
        depth: 0,
        radius: 25,
        color: colors[0],
      },
      ...createNodes(nodes, data),
    ],
    links: createLinks(nodes, data),
  };
}
