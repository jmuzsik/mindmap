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
    id: null,
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
  structureId: null,
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
      const currentSubject = user.currentSubject;
      const notes = await getNotes();
      const images = await getImages();
      const subject = await getSubject(currentSubject);
      const subjects = await getSubjects(currentSubject, user._id);
      const tree = await getMindMapTreeData({
        state: { images, notes },
      });
      const structure = JSON.parse(tree.structure);
      // // const structure = createMindMapTreeData(treeJSON, subject);
      // // const mindMapStructure = createMindMapStructure(treeJSON, subject);
      structure.id = tree._id;
      // console.log(notes, images, subject, subjects, tree, structure)
      setTreeData({
        ...treeData,
        data: [notes, images],
        subject,
        subjects,
        // structure: [structure],
        dimensions: getDim(svgRef, isOpen),
        // // mindMapStructure,
        // data: createTreeMap({
        //   images,
        //   notes,
        //   hooks: { changeData, setTreeData },
        // }),
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
      console.log(dataChange)
      const data = JSON.parse(JSON.stringify(treeData.data))
      if (dataChange.notes === true) {
        data[0].push(dataChange.note);
      } else {
        data[1].push(dataChange.image);
      }

      setTreeData({ ...treeData, data });
    }
    if (!!dataChange.dataId && !!dataChange.structureId) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }
    // Handle deletion and edit
    if (dataChange.update === true) {
      // handleFetchItems();
    }
    // Subject change

    if (dataChange.newSubject === true) {
      AuthClass.setUser({
        ...AuthClass.getUser(),
        currentSubject: dataChange.currentSubject._id,
      });
      treeData.subjects.push(dataChange.currentSubject);
      setTreeData({
        ...treeData,
        subject: dataChange.currentSubject,
      });
    }
    if (dataChange.updateSubject === true) {
      AuthClass.setUser({
        ...AuthClass.getUser(),
        currentSubject: dataChange.currentSubject._id,
      });
      setTreeData({
        ...treeData,
        subject: dataChange.currentSubject,
      });
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
