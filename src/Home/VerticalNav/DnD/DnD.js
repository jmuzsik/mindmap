import React, { memo, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTree from "./Tree/DataTree";
import MindMapTree from "./Tree/MindMapTree.js";
import { createTreeBoxes, createTreeDustbins } from "./utils";

const TreeContainer = memo(function TreeContainer(props) {
  const {
    treeData: { data, structure, subject, names },
    changeData,
  } = props;

  let [dataContents, mindMapContents] = [
    createTreeBoxes({
      data,
      changeData,
      names,
    }),
    createTreeDustbins({
      data,
      structure,
      subject,
      changeData,
      names,
    }),
  ];

  const update = { subject, structure, data, names };
  return (
    <div className="tree-map">
      <DataTree update={update} contents={dataContents} />
      <MindMapTree contents={mindMapContents} update={update} />
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
