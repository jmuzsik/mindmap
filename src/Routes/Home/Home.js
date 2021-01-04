import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AuthClass from "../../TopLevel/Auth/Class";
import createGetOptions from "../../Utils/FetchOptions/Get";
import MindMap from "../../Components/Mindmap/Mindmap";
import DataTree from "../../Components/Tree/DataTree";
import MindTree from "../../Components/Tree/MindTree.js";
import { TreeContainer } from "../../Components/Tree/Container";

import Layout from "../../Components/Layout/Layout";

import {
  createTreeMap,
  tempImages,
  tempNotes,
  createSmap,
  createMindTree,
} from "./utils";

import "./Home.css";

async function getNotes(setNotes) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/user/${id}`;
  const options = createGetOptions();
  let notes = await fetch(url, options);
  // TODO: handle error
  notes = await notes.json();
  if (!notes.error) {
    setNotes(notes);
  }
}
async function getMindTree(setMindTree) {
  const user = AuthClass.getUser();
  const id = user._id;
  const currentSubject = user.currentSubject;
  const url = `/api/tree/${id}/${currentSubject}`;
  const options = createGetOptions();
  let tree = await fetch(url, options);
  // TODO: handle error
  tree = await tree.json();
  if (!tree.error) {
    console.log(tree);
    setMindTree(createMindTree(JSON.parse(tree.json)))
  }
}

async function getImages(setImages) {
  const id = AuthClass.getUser()._id;
  let url = `/api/image/${id}`;
  let options = createGetOptions();
  let images;
  try {
    images = await fetch(url, options);
  } catch (error) {
    // TODO: handle this
  }
  images = await images.json();

  const finalArray = [];
  options = createGetOptions(null, "blob");
  for (let i = 0; i < images.length; i++) {
    const currentImg = images[i];
    const idx = images[i].imgId;
    url = `/api/image/user/${idx}`;
    let image;
    try {
      image = await fetch(url, options);
    } catch (error) {
      // TODO: handle errorrrrrr
    }
    image = await image.blob();
    image = URL.createObjectURL(image);
    finalArray.push({
      src: image,
      id: idx,
      width: currentImg.width,
      height: currentImg.height,
    });
  }
  setImages(finalArray);
}

async function getSubject(subjectId, setSubject) {
  const url = `/api/subject/${subjectId}`;
  const getOptions = createGetOptions();
  let subject;
  try {
    subject = await fetch(url, getOptions);
    subject = await subject.json();
  } catch (error) {
    console.log("within fetching subject by id", error);
  }
  setSubject(subject);
}

export default function Home(props) {
  const user = AuthClass.getUser();
  const currentSubject = user.currentSubject;
  const [notes, setNotes] = useState(tempNotes);
  const [images, setImages] = useState([]);
  const [mindTree, setMindTree] = useState([
    {
      label: "",
      id: 0,
      className: "folder",
      icon: "folder-close",
      hasCaret: true,
      childNodes: [],
    },
  ]);
  const [treeMap, setTreeMap] = useState([]);
  const [subject, setSubject] = useState({
    name: "",
  });

  // TODO: usecallback/refs/etc here
  useEffect(() => {
    // getNotes(setNotes);
    getImages(setImages);
    getMindTree(setMindTree);
    return () => {
      // setNotes([]);
      setImages([]);
    };
  }, []);

  useEffect(() => {
    setTreeMap(createTreeMap({ images, notes }));
    return () => {
      setTreeMap([]);
    };
  }, [images, notes]);

  useEffect(() => {
    getSubject(currentSubject, setSubject);
  }, [currentSubject]);

  const note = notes[0];
  const smap = createSmap(note);

  console.log(mindTree)
  return (
    <Layout {...props}>
      {/* <MindMap nodes={sMap.nodes} connections={sMap.connections} /> */}
      <DndProvider backend={HTML5Backend}>
        <TreeContainer>
          <DataTree nodes={treeMap} />
          <MindTree setMindTree={setMindTree} nodes={mindTree} />
        </TreeContainer>
      </DndProvider>
    </Layout>
  );
}
