import React, { memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Callout, Intent } from "@blueprintjs/core";
import DataTree from "./Tree/DataTree";
import MindMapTree from "./Tree/MindMapTree.js";
import { createTreeBoxes, createTreeDustbins } from "./utils";

const TreeContainer = memo(function TreeContainer({
  state: {
    treeData: { data, structure, subject, names },
    showDnDCallout,
    settings,
  },
  hooks: { changeData, setShowDnDCallout, setUser },
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
        setShowDnDCallout,
        setUser,
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
        setShowDnDCallout,
        setUser,
      },
    }),
  ];

  // Used to cause an update when there is a change in data
  const update = JSON.stringify({ subject, structure, data, names, settings });
  return (
    <div className="tree-map">
      {showDnDCallout && (
        <Callout
          intent={Intent.PRIMARY}
          icon="info-sign"
          title="Drag and drop your content"
        >
          To create a mind map and a drag and drop container, drag content into
          the folder below named by your subject.
        </Callout>
      )}
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
