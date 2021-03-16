import React from "react";

import Editor from "../../../../Components/Editor";
import { InnerContent } from "../../utils";

import db from "../../../../db";

function createContent(props) {
  const { type, data } = props;
  return (
    <div className={`dnd-content ${type}-content`}>
      <InnerContent data={data} />
    </div>
  );
}

/**
 *
 * @param {object} data - the data object related to node
 * @param {Number} depth - how far into the tree we currently are (either 0,1,2)
 */
function calcLocation(data, depth, dimensions) {
  let left, top;
  // Two options here (either centered or necessary to manually calculate)
  // ie. data.x/data.y equals 'center' or use current x/y
  // They are either set to these strings or a number (when data.x is a string, so is data.y)
  if (depth === 0 && data.x === "center") {
    left = 0.5 * dimensions.width;
    top = 0.5 * dimensions.height;
    return { left, top };
  }
  left = data.x;
  top = data.y;
  return { left, top };
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

export function createBoxesContent({
  user,
  data,
  structure,
  subject,
  dimensions,
}) {
  const structureCopy = JSON.parse(JSON.stringify(structure));
  const nodes = flatten(structureCopy.childNodes);
  const nodesWithDataAndContent = nodes.reduce((obj, n) => {
    const d = data.find(({ id }) => id === n.dataId);
    obj[n.nodeId] = {
      ...n,
      data: d,
      ...calcLocation(d, n.depth, dimensions),
      zIndex: d.zIndex,
      content: createContent({ type: n.type, id: n.id, data: d }),
    };
    return obj;
  }, {});
  // update zIndex on user for future use
  db.user.update(user.id, {
    zIndex: user.zIndex + nodes.length + 1,
  });
  // I am using the same data format that the example of the node module i am using used
  // ie. {a: {}, b: {}} rather than array of objects
  return Object.assign(
    {
      [`subject-${subject.id}`]: {
        content: (
          <div className="dnd-content subject-content">
            <Editor
              contentEditable={false}
              readOnly={true}
              editorState={subject.content}
              setEditorState={() => null}
              theme="bubble"
            />
          </div>
        ),
        id: subject.id,
        nodeId: `subject-${subject.id}`,
        data: subject,
        type: "subject",
        depth: 0,
        // on top of rest of content at start
        ...calcLocation(subject, 0, dimensions),
        zIndex: subject.zIndex,
      },
    },
    nodesWithDataAndContent
  );
}
