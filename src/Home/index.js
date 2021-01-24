import React, { useState, useEffect, useCallback, useRef } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import { useDeepEffect } from "../Utils/utils";
import MindMapContainer from "./Mindmap/Container";

import db from "../db";

import "./Home.css";

// [[notes],[images]]
const DEF_TREE_DATA = [[], []];

const DEF_STRUCTURE_DATA = {
  id: 0,
  // subject
  type: "subject",
  name: "",
  childNodes: [
    // image or note with id, type, nodes
  ],
};

const DEF_SUBJECT_DATA = { name: "", id: 0, id: 0 };
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
      const user = await db.user.toCollection().first();
      const subjectId = user.currentSubject;
      const subject =
        (await db.subjects.get({ id: subjectId })) || DEF_SUBJECT_DATA;
      const subjects = (await db.subjects.toArray()) || [];
      const notes = (await db.notes.where({ subjectId }).toArray()) || [];
      const images = (await db.images.where({ subjectId }).toArray()) || [];
      const tree = await db.trees.get({ subjectId });
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
    let data, noteOrImage, dataObj, idx;
    console.log(dataChange);
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
        noteOrImage = dataChange.type === "note" ? 0 : 1;
        dataObj = update(treeData, {
          data: {
            [noteOrImage]: (arr) =>
              arr.filter((item) => item.id !== dataChange.id),
          },
        });
        setTreeData(dataObj);
        break;
      case "edit":
        // can only edit notes atm which are at index 0
        idx = treeData.data[0].findIndex(({ id }) => id === dataChange.note.id);
        dataObj = update(treeData, {
          data: { 0: { [idx]: { $set: dataChange.note } } },
        });
        data[0][idx] = dataChange.note;
        setTreeData(dataObj);
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
      case "updateTreeSingular":
        // Can i use immutability helper rather than a deep copy?
        noteOrImage = dataChange.type === "note" ? 0 : 1;
        idx = treeData.data[noteOrImage].findIndex(
          ({ id }) => id === dataChange.item.id
        );
        dataObj = update(treeData, {
          data: {
            [noteOrImage]: {
              [idx]: {
                inTree: {
                  $set: dataChange.item.inTree,
                },
              },
            },
          },
          structure: {
            $set: dataChange.structure,
          },
        });
        setTreeData(dataObj);
        break;
      case "updateTree":
        data = JSON.parse(JSON.stringify(treeData.data));
        for (let i = 0; i < dataChange.data.length; i++) {
          const [d, t] = dataChange.data[i];
          noteOrImage = t === "note" ? 0 : 1;
          const idx = data[noteOrImage].findIndex(({ id }) => id === d.id);
          // I need to keep blob from image
          data[noteOrImage][idx] = {
            ...data[noteOrImage][idx],
            inTree: d.inTree,
          };
        }
        dataObj = update(treeData, {
          data: { $set: data },
          structure: { $set: dataChange.structure },
        });
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
          ({ id }) => id !== dataChange.id
        );
        for (let i = 0; i < dataChange.data.length; i++) {
          const [d, t] = dataChange.data[i];
          noteOrImage = t === "note" ? 0 : 1;
          const idx = data[noteOrImage].findIndex(({ id }) => id === d.id);
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
        <MindMapContainer treeData={treeData} />
      </main>
    </section>
  );
}
