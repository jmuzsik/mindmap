import React from "react";

import { InnerContent } from "../../utils";

function createContent(props) {
  const { type, id, data } = props;
  return (
    <div className="treenode-content">
      <InnerContent {...{ id, data, type }} />
    </div>
  );
}

function getLocationOfParent(id, dimensions) {
  // start at center
  let left = 0.5,
    top = 0.5;
  switch (id) {
    case "1":
      left = 0.25;
      break;
    case "2":
      left = 0.75;
      break;
    case "3":
      top = 0.25;
      break;
    case "4":
      top = 0.75;
      break;
    case "5":
      left = 0.375;
      top = 0.375;
      break;
    case "6":
      left = 0.625;
      top = 0.375;
      break;
    case "7":
      left = 0.375;
      top = 0.625;
      break;
    case "8":
      left = 0.625;
      top = 0.625;
      break;
    default:
      console.warn("should never reach here");
    // should never be reached
    // left = "25%";
    // top = "50%";
  }
  return { left: left * dimensions.width, top: top * dimensions.height };
}

// Max of 4 children
function getLocationFromParent(parent, count) {
  switch (count) {
    case "0":
      return { left: parent.left / 2, top: parent.top };
    case "1":
      return { left: parent.left, top: parent.top / 2 };
    case "2":
      return { left: parent.left * 1.5, top: parent.top };
    case "3":
      return { left: parent.left, top: parent.top * 1.5 };
    default:
      console.warn("should never be here", parent, count);
  }
}

/**
 *
 * @param {object} data - the data object related to the note or image
 * @param {Number} count - the indece of the childNodes related to parent
 * @param {Number} depth - how far into the tree we currently are (either 0,1,2)
 */
function calcLocation(data, depth, parent, id, dimensions) {
  let left, top, zIndex;
  // start at center, gradually decrease z-index for increasing depth
  let transform = "translateX(-50%) translateY(-50%)";
  // Two options here (either centered or necessary to manually calculate)
  // ie. data.x/data.y equals 'center' or 'calc'
  // They are either set to these strings or a number (when data.x is a string, so is data.y)
  if (depth === 0 && data.x === "center") {
    zIndex = 100;
    left = 0.5 * dimensions.width;
    top = 0.5 * dimensions.height;
    return { transform, left, top, zIndex };
  }
  if (depth === 1 && data.x === "calc") {
    zIndex = 50;
    const res = getLocationOfParent(id, dimensions);
    return { transform, left: res.left, top: res.top, zIndex };
  } else if (depth === 2 && data.x === "calc") {
    zIndex = 25;
    // ex. 1.2 -> 2
    const count = id.split(".")[1];
    const parentLocations = getLocationOfParent(parent, dimensions);
    const res = getLocationFromParent(parentLocations, count);
    return { transform, left: res.left, top: res.top, zIndex };
  }
  return;
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
  data,
  structure,
  subject,
  changeData,
  dimensions,
}) {
  const structureCopy = JSON.parse(JSON.stringify(structure));
  const nodes = flatten(structureCopy.childNodes);
  const nodesWithDataAndContent = nodes.reduce((obj, n) => {
    const noteOrImage = n.type === "note" ? 0 : 1;
    const d = data[noteOrImage].find(({ id }) => id === n.dataId);
    obj[`${n.type}-${n.id}`] = {
      ...n,
      data: d,
      ...calcLocation(d, n.depth, n.parent, n.id, dimensions),
      content: createContent({ type: n.type, id: n.id, data: d }),
    };
    return obj;
  }, {});
  // I am using the same data format that the example of the node module i am using used
  // ie. {a: {}, b: {}} rather than array of objects
  return Object.assign(
    {
      [`subject-${subject.id}`]: {
        content: <h1>{subject.name}</h1>,
        id: subject.id,
        type: "subject",
        depth: 0,
        ...calcLocation(subject, 0, null, subject.id, dimensions),
      },
    },
    nodesWithDataAndContent
  );
}

// const [boxes, setBoxes] = useState({
//   // TODO: This must be changed
//   a: { left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)", content: "Drag me around" },
//   b: { top: 180, left: 20, content: "Drag me too" },
// });
