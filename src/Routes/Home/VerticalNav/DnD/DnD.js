import React, { memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTree from "./Tree/DataTree";
import MindMapTree from "./Tree/MindMapTree.js";

const TreeContainer = memo(function TreeContainer(props) {
  return <div className="tree-map">{props.children}</div>;
});

export default function DnDContainer(props) {
  const { treeData } = props;
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <TreeContainer>
          <DataTree
            data={treeData.data}
            hooks={{ changeData: props.changeData }}
            // nodes={createTreeBoxes({
            //   data: treeData.data,
            //   hooks: { changeData: props.changedata },
            // })}
          />
          <MindMapTree
            data={treeData.data}
            structure={treeData.structure}
            subject={treeData.subject}
          />
        </TreeContainer>
      </DndProvider>
    </React.Fragment>
  );
}
