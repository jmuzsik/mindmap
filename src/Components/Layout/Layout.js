import React, { useState, useEffect, useCallback, useRef } from "react";

import HorizontalNav from "../Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../Navigation/VerticalNav/VerticalNav";
import MindMap from "../Mindmap/Mindmap.js";

import "./Layout.css";

import { useDeepEffect } from "../../Utils/utils";
import AuthClass from "../../TopLevel/Auth/Class";
import Network from "./Network";

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
  updateFolder,
  updateTree,
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
      id: "0",
      radius: 20,
      depth: 0,
      label: null,
      jsx: null,
      color: "#2965CC",
    },
  ],
  links: [],
};

const DEF_DIMENSIONS = { width: null, height: null };

function getDim(ref, isOpen) {
  if (ref.current) {
    const [width, height] = [ref.current.clientWidth, ref.current.clientHeight];
    if (isOpen) {
      return {
        width: width - width / 4,
        height,
      };
    } else {
      return { width, height };
    }
  }
}

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

  // https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
  // This is done to keep track of the size of the svg mindmap
  // - as i have to work with height/width of elemtns within
  //   the svg
  const svgRef = useRef();
  const [treeData, setTreeData] = useState({
    structure: DEF_STRUCTURE_DATA,
    data: DEF_TREE_DATA,
    subject: DEF_SUBJECT_DATA,
    subjects: DEF_SUBJECTS_DATA,
    mindMapStructure: DEF_MINDMAP_STRUCTURE,
    dimensions: DEF_DIMENSIONS,
  });
  const [dataChange, changeData] = useState(DEF_DATA_CHANGE);

  const treeUpdate = async () => {
    // const tree = await updateTree(treeData.structure, treeData.structure.id);
    // const data = JSON.parse(tree.json);
    // setTreeData({ ...treeData, structure: { ...data, id: tree._id } });
  };

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
      const treeJSON = JSON.parse(tree.json);
      const subject = await getSubject(currentSubject);
      const subjects = await getSubjects(currentSubject, user._id);
      const mindMapTree = createMindMapTreeData(treeJSON, subject);
      const mindMapStructure = createMindMapStructure(treeJSON, subject);
      mindMapTree.id = tree._id;
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
        dimensions: getDim(svgRef, isOpen),
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
    if (!!dataChange.dataId && !!dataChange.structureId) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }
    // Handle deletion and edit
    if (dataChange.update === true) {
      handleFetchItems();
    }
    // Handle insertion
    if (dataChange.newData === true) {
      const type = dataChange.notes === true ? "notes" : "images";
      updateFolder(treeData, { setTreeData, changeData }, type);
    }
    // Subject change
    if (dataChange.updateSubject === true) {
      AuthClass.setUser({
        ...AuthClass.getUser(),
        currentSubject: dataChange.currentSubject,
      });
      handleFetchItems();
    }
    if (dataChange.updateTree) {
      treeUpdate();
    }
  }, [dataChange]);

  useEffect(() => {
    if (treeData.dimensions.width && treeData.dimensions.height) {
      setTreeData({
        // TODO: i need to update the tree data here
        ...treeData,
        dimensions: getDim(svgRef, isOpen),
      });
    }
  }, [isOpen]);

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
      <main ref={svgRef}>
        <VerticalNav
          {...{ history, isOpen, setOpen, treeData, changeData, setTreeData }}
        />
        {/* <MindMap
          {...{
            ...props,
            nodes: treeData.mindMapStructure.nodes,
            connections: treeData.mindMapStructure.connections,
          }}
        /> */}
        <div
          className="network-container"
          style={{
            height: treeData.dimensions.height,
            width: treeData.dimensions.width,
          }}
        >
          <Network history={history} data={treeData.mindMapStructure} />
        </div>
      </main>
    </section>
  );
}
