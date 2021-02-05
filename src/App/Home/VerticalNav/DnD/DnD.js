import React, { memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { UserContext } from "../../../utils";
import DataTree from "./Tree/DataTree";
import MindMapTree from "./Tree/MindMapTree.js";
import { createTreeBoxes, createTreeDustbins } from "./utils";

const TreeContainer = memo(function TreeContainer({
  state: {
    treeData: { data, structure, subject, names },
    settings,
  },
  hooks: { changeData },
}) {
  let [dataContents, mindMapContents] = [
    createTreeBoxes({
      state: {
        data,
        names,
        settings,
      },
      hooks: {
        changeData,
      },
    }),
    createTreeDustbins({
      state: {
        data,
        names,
        subject,
        structure,
      },
      hooks: {
        changeData,
      },
    }),
  ];

  // Used to cause an update when there is a change in data
  const update = JSON.stringify({ subject, structure, data, names });

  return (
    <div className="tree-map">
      <DataTree update={update} contents={dataContents} />
      <MindMapTree update={update} contents={mindMapContents} />
    </div>
  );
});

export default function DnDContainer(props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TreeContainer {...props} />
    </DndProvider>
  );
}
