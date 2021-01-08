import React, { useState, useEffect, useCallback } from "react";

import HorizontalNav from "../Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../Navigation/VerticalNav/VerticalNav";
import MindMap from "../Mindmap/Mindmap.js";

import "./Layout.css";

import { useDeepEffect } from "../../Utils/utils";
import AuthClass from "../../TopLevel/Auth/Class";

import {
  tempImages,
  tempNotes,
  createSmap,
  createTreeMap,
  createMindMapTreeData,
  handleDataChange,
  createMindMapStructure,
} from "./utils";

import { getImages, getMindMapTreeData, getNotes } from "./requests";
import { getSubject } from "../../Components/Navigation/HorizontalNav/utils";

const DEF_TREE_DATA = [
  { id: 0, childNodes: [] },
  { id: 1, childNodes: [] },
];
const DEF_STRUCTURE_DATA = [
  {
    label: "",
    id: 0,
    className: "folder",
    icon: "folder-close",
    hasCaret: true,
    childNodes: [],
  },
];

const DEF_SUBJECT_DATA = { name: "" };

const DEF_DATA_CHANGE = { structureId: null, dataId: null };

const DEF_MINDMAP_STRUCTURE = {
  nodes: [
    {
      content: "",
      id: 0,
      fx: 0,
      fy: 0,
      width: 0,
      height: 0,
      nodes: [],
    },
  ],
  connections: [
    // {
    //   source: "1",
    //   target: "3",
    // },
  ],
};

// This is where the primary data is located
// Two different data objects
// One contains each image and note sort of as so:
// - [{images: [...]}, {notes: [...]}]
// The other contains the current tree structure within the mindmap/droppable container
// - [{childNodes: [{childNodes: [...]}, ...]}]
// For both objects there are additional key/values
export default function Layout(props) {
  const [isOpen, setOpen] = useState(false);
  const open = isOpen ? "open" : "closed";

  const [treeData, setTreeData] = useState({
    structure: DEF_STRUCTURE_DATA,
    data: DEF_TREE_DATA,
    subject: DEF_SUBJECT_DATA,
    mindMapStructure: DEF_MINDMAP_STRUCTURE,
  });
  const [dataChange, changeData] = useState(DEF_DATA_CHANGE);
  // This is to be displayed if user has no subjects

  const handleFetchItems = useCallback(() => {
    (async () => {
      const user = AuthClass.getUser();

      const currentSubject = user.currentSubject;
      // const notes = await getNotes();
      // const images = await getImages();
      const notes = tempNotes;
      const images = tempImages;
      const tree = await getMindMapTreeData({
        state: { images, notes },
      });
      const subject = await getSubject(currentSubject);
      console.log(subject);
      const mindMapTree = createMindMapTreeData(tree);
      const mindMapStructure = createMindMapStructure(tree, subject);

      setTreeData({
        subject,
        structure: mindMapTree,
        mindMapStructure,
        data: createTreeMap({
          images,
          notes,
          hooks: { changeData },
        }),
      });
    })();
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData();
    };
  }, []);

  useDeepEffect(() => {
    if (dataChange.dataId !== null && dataChange.structureId !== null) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }
  }, [dataChange]);

  const sMap = createSmap();
  const { setAuthInfo, onLogout, authInfo, history } = props;

  return (
    <section className={`layout ${open}`}>
      <HorizontalNav {...{ setAuthInfo, onLogout, authInfo, history }} />
      <main>
        <VerticalNav {...{ history, isOpen, setOpen, treeData, setTreeData }} />
        <MindMap
          {...{
            ...props,
            nodes: treeData.mindMapStructure.nodes,
            connections: treeData.mindMapStructure.connections,
          }}
        />
      </main>
    </section>
  );
}
