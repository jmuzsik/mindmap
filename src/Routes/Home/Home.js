import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AuthClass from "../../TopLevel/Auth/Class";
import DataTree from "../../Components/Tree/DataTree";
import MindMapTree from "../../Components/Tree/MindMapTree.js";
import { TreeContainer } from "../../Components/Tree/Container";

import "./Home.css";

import { createCallout } from "./utils";

export default function Home(props) {
  const { treeData, setTreeData } = props;
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
      {/* <MindMap nodes={sMap.nodes} connections={sMap.connections} /> */}
      {callout}
      <DndProvider backend={HTML5Backend}>
        <Inner treeData={treeData} />
      </DndProvider>
    </div>
  );
}

function Inner(props) {
  const { structure, data } = props.treeData;
  console.log(structure)
  return (
    <TreeContainer>
      <DataTree nodes={data} />
      <MindMapTree nodes={structure.nodes} />
    </TreeContainer>
  );
}
