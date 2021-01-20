import React, { useState, useEffect, useCallback, useRef } from "react";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import { useDeepEffect } from "../../Utils/utils";
import AuthClass from "../../TopLevel/Auth/Class";
import Network from "./Mindmap/Network";

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
  getNote,
  getImage,
} from "./requests";

import "./Home.css";

// [[notes],[images]]
const DEF_TREE_DATA = [[], []];

const DEF_STRUCTURE_DATA = [
  {
    id: 0,
    // subject
    type: "subject",
    name: "",
    childNodes: [
      // image or note with id, type, nodes
    ],
  },
];

const DEF_SUBJECT_DATA = { name: "", _id: null };
const DEF_SUBJECTS_DATA = [];

const DEF_DATA_CHANGE = {
  parentId: null,
  dataId: null,
  update: null,
  newData: null,
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

export default function Home(props) {
  const [isOpen, setOpen] = useState(true);
  const open = isOpen ? "open" : "closed";

  // https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
  // This is done to keep track of the size of the svg mindmap
  // - as i have to work with height/width of elements within
  //   the svg
  const svgRef = useRef();
  const [treeData, setTreeData] = useState({
    // [[], []]
    data: DEF_TREE_DATA,
    structure: DEF_STRUCTURE_DATA,
    subject: DEF_SUBJECT_DATA,
    subjects: DEF_SUBJECTS_DATA,
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
      console.log(user);
      const currentSubject = user.currentSubject;
      const subjects = await getSubjects(currentSubject, user._id);
      const notes = await getNotes();
      const images = await getImages();
      const subject = await getSubject(currentSubject);
      const tree = await getMindMapTreeData();
      const structure = JSON.parse(tree.structure);

      setTreeData({
        ...treeData,
        data: [notes, images],
        subject,
        subjects,
        structure,
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

  useDeepEffect(async () => {
    // TODO: Make this a switch statement - perhaps utilise a reducer!
    // Handle insertion
    if (dataChange.newData === true) {
      // All i want to do here is alter the state for the corresponding data
      const data = JSON.parse(JSON.stringify(treeData.data));
      if (dataChange.notes === true) {
        data[0].push(dataChange.note);
      } else {
        data[1].push(dataChange.image);
      }

      setTreeData({ ...treeData, data });
    }
    if (!!dataChange.dataId && !!dataChange.parentId) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }

    if (dataChange.delete === true) {
      const data = JSON.parse(JSON.stringify(treeData.data));
      const noteOrImage = dataChange.type === "note" ? 0 : 1;
      data[noteOrImage] = data[noteOrImage].filter(
        ({ _id }) => _id !== dataChange.id
      );
      setTreeData({ ...treeData, data });
    }
    if (dataChange.edit === true) {
      // can only edit notes atm which are at index 0
      const data = JSON.parse(JSON.stringify(treeData.data));
      const idx = data[0].findIndex(({ _id }) => _id === dataChange.note._id);
      data[0][idx] = dataChange.note;
      setTreeData({ ...treeData, data });
    }
    // Subject change

    if (dataChange.newSubject === true) {
      const subjects = JSON.parse(JSON.stringify(treeData.subjects));
      subjects.push(dataChange.currentSubject);
      setTreeData({
        ...treeData,
        subjects,
        subject: dataChange.currentSubject,
        data: dataChange.data,
        structure: dataChange.structure,
      });
    }
    if (dataChange.updateSubject === true) {
      AuthClass.setUser({
        ...AuthClass.getUser(),
        currentSubject: dataChange.currentSubject._id,
      });
      setTreeData({
        ...treeData,
        ...dataChange.data,
      });
    }
    if (dataChange.updateTree) {
      const data = JSON.parse(JSON.stringify(treeData.data));
      for (let i = 0; i < dataChange.data.length; i++) {
        const [d, t] = dataChange.data[i];
        const noteOrImage = t === "note" ? 0 : 1;
        const idx = data[noteOrImage].findIndex(({ _id }) => _id === d._id);
        data[noteOrImage][idx] = d;
      }
      setTreeData({
        ...treeData,
        data,
        structure: dataChange.structure,
      });
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
  console.log(treeData);
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
        {/* <div
          className="network-container"
          style={{
            height: treeData.dimensions.height,
            width: treeData.dimensions.width,
          }}
        >
          <Network history={history} data={treeData.mindMapStructure} />
        </div> */}
      </main>
    </section>
  );
}
