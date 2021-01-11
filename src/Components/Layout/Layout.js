import React, { useState, useEffect, useCallback } from "react";

import HorizontalNav from "../Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../Navigation/VerticalNav/VerticalNav";
import MindMap from "../Mindmap/Mindmap.js";

import "./Layout.css";

import { useDeepEffect } from "../../Utils/utils";
import AuthClass from "../../TopLevel/Auth/Class";

import {
  createTreeMap,
  createMindMapTreeData,
  handleDataChange,
  createMindMapStructure,
} from "./utils";

import {
  getImages,
  getMindMapTreeData,
  getNotes,
  getSubjects,
  getSubject,
} from "./requests";

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
const DEF_SUBJECTS_DATA = [{ name: "" }];

const DEF_DATA_CHANGE = {
  structureId: null,
  dataId: null,
  update: null,
  newData: null,
};

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
  const [isOpen, setOpen] = useState(true);
  const open = isOpen ? "open" : "closed";

  const [treeData, setTreeData] = useState({
    structure: DEF_STRUCTURE_DATA,
    data: DEF_TREE_DATA,
    subject: DEF_SUBJECT_DATA,
    subjects: DEF_SUBJECTS_DATA,
    mindMapStructure: DEF_MINDMAP_STRUCTURE,
  });
  const [dataChange, changeData] = useState(DEF_DATA_CHANGE);
  // This is to be displayed if user has no subjects

  const handleFetchItems = useCallback(() => {
    (async () => {
      const user = AuthClass.getUser();

      const currentSubject = user.currentSubject;
      const notes = await getNotes();
      const images = await getImages();
      // const notes = tempNotes;
      // const images = tempImages;
      const tree = await getMindMapTreeData({
        state: { images, notes },
      });
      const subject = await getSubject(currentSubject);
      const subjects = await getSubjects(currentSubject, user._id);
      const mindMapTree = createMindMapTreeData(tree);
      const mindMapStructure = createMindMapStructure(tree, subject);

      setTreeData({
        subject,
        subjects,
        structure: mindMapTree,
        mindMapStructure,
        data: createTreeMap({
          images,
          notes,
          hooks: { changeData, setTreeData },
        }),
      });
    })();
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData();
    };
  }, [handleFetchItems]);

  useDeepEffect(() => {
    if (dataChange.dataId && dataChange.structureId) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }
    // Handle deletion and edit
    if (dataChange.update === true) {
      handleFetchItems();
    }
    // Handle insertion
    if (dataChange.newData === true) {
      handleFetchItems();
    }
    // Subject change
    if (dataChange.updateSubject === true) {
      AuthClass.setUser({
        ...AuthClass.getUser(),
        currentSubject: dataChange.currentSubject,
      });
      handleFetchItems();
    }
  }, [dataChange]);

  const { history } = props;

  return (
    <section className={`layout ${open}`}>
      <HorizontalNav
        {...{
          ...props,
          changeData,
          subjectsData: {
            subjects: treeData.subjects,
            subject: treeData.subject,
          },
        }}
      />
      <main>
        <VerticalNav
          {...{ history, isOpen, setOpen, treeData, changeData, setTreeData }}
        />
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
