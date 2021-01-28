import React from "react";
import { useDrag } from "react-dnd";

import { findNode } from "../../../utils";

import db from "../../../../db";

async function handleUpdate({ parent, data }, changeData) {
  console.log(parent, data)
  // Need number type for comparison
  // type is also available: const [parentType, parentId] = parent.split(',');
  const parentSplit = parent.split("-");
  const parentId = Number(parentSplit[1]);
  // First find the data object with dataId
  let [dataType, dataId] = data.split("-");
  dataId = Number(dataId);
  // note -> notes image -> images
  await db[dataType + "s"].update(dataId, { inTree: true });
  const item = await db[dataType + "s"].get(dataId);

  // update to inTree -> true
  // Then get the tree of current subject and update the tree with data
  const user = await db.user.toCollection().first();
  const tree = await db.trees.get({ subjectId: user.currentSubject });
  const structure = tree.structure;
  const node = findNode(parentId, tree.structure, {}, false);
  console.log(structure, node, parentId)
  node.childNodes.push({
    id: item.id,
    nodeId: data,
    type: dataType,
    childNodes: [],
  });
  // update tree
  await db.trees.update(tree.id, { structure });
  console.log(item, structure)
  changeData({ update: "updateTreeSingular", item, type: dataType, structure });
}

export const Box = ({ name, content, hooks: { changeData } }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name, type: "box" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // I need to do api calls here so as not to do it in the useEffect
        // of the home component
        handleUpdate(
          {
            // problem with name being a zero
            parent: dropResult.name,
            data: item.name,
          },
          changeData
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} className="box" style={{ opacity }}>
      {content}
    </div>
  );
};
