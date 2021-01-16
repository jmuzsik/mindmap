import React, { useState, useEffect, memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AuthClass from "../../../../TopLevel/Auth/Class";
import DataTree from "./Tree/DataTree";
import MindMapTree from "./Tree/MindMapTree.js";

import { createCallout } from "./utils";

const TreeContainer = memo(function TreeContainer(props) {
  return <div className="tree-map">{props.children}</div>;
});


export default function Home(props) {
  const { treeData } = props;
  const [callout, setCallout] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = AuthClass.getUser();
      const currentSubject = user.currentSubject;
      if (currentSubject.length === 0) {
        setCallout(createCallout());
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {callout}
      <DndProvider backend={HTML5Backend}>
        <TreeContainer>
          <DataTree nodes={treeData.data} />
          <MindMapTree nodes={treeData.structure.nodes} />
        </TreeContainer>
      </DndProvider>
    </div>
  );
}
