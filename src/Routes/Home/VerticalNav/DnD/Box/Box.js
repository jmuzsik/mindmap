import React from "react";
import { useDrag } from "react-dnd";

import {
  getMindMapTreeData,
  updateInTree,
  updateTree,
  findNode,
} from "../../../requests";

async function handleBackendUpdate({ parentId, dataId }, changeData) {
  // First find the data object with dataId
  const data = [await updateInTree(dataId, true)];
  // Then get the tree of current subject and update the tree with data
  const tree = await getMindMapTreeData();
  const structure = JSON.parse(tree.structure);

  const node = findNode(parentId, structure[0], {}, false);
  node.childNodes.push({
    id: data[0][0]._id,
    type: data[0][1],
    childNodes: [],
  });
  const updatedStructure = await updateTree(structure, tree._id);
  console.log(data, updatedStructure)
  changeData({ updateTree: true, data, structure: updatedStructure });
}

export const Box = ({ name, content, hooks: { changeData } }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name, type: "box" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // I need to do api calls here so as not to do it in the useEffect
        // of the home component
        handleBackendUpdate(
          {
            // problem with name being a zero
            parentId: String(dropResult.name),
            dataId: String(item.name),
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
