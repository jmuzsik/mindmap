import React, { useState, useEffect, useCallback, useRef } from "react";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";

import "./Home.css";

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

// [[notes],[images]]
const DEF_TREE_DATA = [[], []];

const DEF_STRUCTURE_DATA = [
  {
    id: null,
    // image or note
    type: "",
    nodes: [],
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
      // const notes = tempNotes;
      // const images = tempImages;
      const tree = await getMindMapTreeData({
        state: { images, notes },
      });
      const structure = JSON.parse(tree.json);
      // const structure = createMindMapTreeData(treeJSON, subject);
      // const mindMapStructure = createMindMapStructure(treeJSON, subject);
      structure.id = tree._id;
      setTreeData({
        subject,
        subjects,
        structure,
        // mindMapStructure,
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

  useDeepEffect(async () => {
    // Handle insertion
    if (dataChange.newData === true) {
      // All i want to do here is alter the state for the corresponding data
      const data = [];
      if (dataChange.notes === true) {
        data[0] = treeData.data[0].push(await getNote(dataChange.id));
        data[1] = treeData.data[1];
      } else {
        data[0] = treeData.data[0];
        data[1] = treeData.data[1].push(await getImage(dataChange.id));
      }
      setTreeData({ ...treeData, data });
    }
    if (!!dataChange.dataId && !!dataChange.structureId) {
      handleDataChange({ treeData, dataChange }, { setTreeData, changeData });
    }
    // Handle deletion and edit
    if (dataChange.update === true) {
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
