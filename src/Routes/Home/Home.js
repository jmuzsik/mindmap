import React, { useState, useEffect, useCallback, useRef } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import { useDeepEffect } from "../../Utils/utils";
import NetworkContainer from "./Mindmap/NetworkContainer";

import db from "../../db";

import "./Home.css";

// [[notes],[images]]
const DEF_TREE_DATA = [[], []];

const DEF_STRUCTURE_DATA = {
  id: 0,
  _id: null,
  // subject
  type: "subject",
  name: "",
  childNodes: [
    // image or note with id, type, nodes
  ],
};

const DEF_SUBJECT_DATA = { name: "", _id: 0, id: 0 };
const DEF_SUBJECTS_DATA = [];

const DEF_DATA_CHANGE = {
  update: "",
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

  const handleFetchItems = useCallback(() => {
    (async () => {
      // TODO: Input this within classes
      let users = await db.user.toArray();
      const user = users[0];
      const subject =
        (await db.subjects.get({ id: user.currentSubject })) ||
        DEF_SUBJECT_DATA;
      const subjects = (await db.subjects.toArray()) || [];
      const notes =
        (await db.notes.where({ subjectId: subject.id }).toArray()) || [];
      const images =
        (await db.images.where({ subjectId: subject.id }).toArray()) || [];
      const tree = await db.trees.get({ subjectId: subject.id });
      const structure = tree?.structure || DEF_STRUCTURE_DATA;
      const dataObj = update(treeData, {
        data: { $set: [notes, images] },
        subject: { $set: subject },
        subjects: { $set: subjects },
        structure: { $set: structure },
        dimensions: { $set: getDim(svgRef, isOpen) },
      });
      setTreeData(dataObj);
    })();
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData();
    };
  }, [handleFetchItems]);

  useDeepEffect(() => {
    let data;
    let noteOrImage;
    let dataObj;
    switch (dataChange.update) {
      case "newData":
        // Handle insertion
        noteOrImage = dataChange.notes === true ? 0 : 1;
        dataObj = update(treeData, {
          data: { [noteOrImage]: { $push: [dataChange.item] } },
        });
        setTreeData(dataObj);
        break;
      case "delete":
        data = JSON.parse(JSON.stringify(treeData.data));
        noteOrImage = dataChange.type === "note" ? 0 : 1;
        data[noteOrImage] = data[noteOrImage].filter(
          ({ _id }) => _id !== dataChange.id
        );
        setTreeData({ ...treeData, data });
        break;
      case "edit":
        // can only edit notes atm which are at index 0
        data = JSON.parse(JSON.stringify(treeData.data));
        const idx = data[0].findIndex(({ _id }) => _id === dataChange.note._id);
        data[0][idx] = dataChange.note;
        setTreeData({ ...treeData, data });
        break;
      case "newSubject":
        dataObj = update(treeData, {
          subjects: {
            $push: [dataChange.subject],
          },
          subject: { $set: dataChange.subject },
          data: { $set: dataChange.data },
          structure: { $set: dataChange.structure },
        });
        setTreeData(dataObj);
        break;
      case "updateSubject":
        dataObj = update(treeData, {
          subject: { $set: dataChange.currentSubject },
          data: { $set: dataChange.data },
        });
        setTreeData(dataObj);
        break;
      case "updateTree":
        data = JSON.parse(JSON.stringify(treeData.data));
        for (let i = 0; i < dataChange.data.length; i++) {
          const [d, t] = dataChange.data[i];
          const noteOrImage = t === "note" ? 0 : 1;
          const idx = data[noteOrImage].findIndex(({ _id }) => _id === d._id);
          // I need to keep blob from image
          data[noteOrImage][idx] = {
            ...data[noteOrImage][idx],
            inTree: d.inTree,
          };
        }
        setTreeData({
          ...treeData,
          data,
          structure: dataChange.structure,
        });
        break;
      case "deleteAndRemove":
        const c = (t) => (t === "note" ? 0 : 1);
        data = JSON.parse(JSON.stringify(treeData.data));
        data[c(dataChange.type)] = data[c(dataChange.type)].filter(
          ({ _id }) => _id !== dataChange.id
        );
        for (let i = 0; i < dataChange.data.length; i++) {
          const [d, t] = dataChange.data[i];
          const noteOrImage = t === "note" ? 0 : 1;
          const idx = data[noteOrImage].findIndex(({ _id }) => _id === d._id);
          data[noteOrImage][idx] = {
            ...data[noteOrImage][idx],
            inTree: d.inTree,
          };
        }
        setTreeData({
          ...treeData,
          data,
          structure: dataChange.structure,
        });
        break;
      default:
        return null;
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
        {/* <NetworkContainer treeData={treeData} /> */}
      </main>
    </section>
  );
}
