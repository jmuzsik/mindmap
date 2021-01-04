import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AuthClass from "../../TopLevel/Auth/Class";
import createGetOptions from "../../Utils/FetchOptions/Get";
import MindMap from "../../Components/Mindmap/Mindmap";
import DataTree from "../../Components/Tree/DataTree";
import MindTree from "../../Components/Tree/MindTree";
import { TreeContainer } from "../../Components/Tree/Container";

import Layout from "../../Components/Layout/Layout";

import { createTreeMap, tempImages, tempNotes, createSmap } from "./utils";

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

function createMap({ notes, images }) {
  const init = { nodes: [] };
}

export default function Home(props) {
  const [notes, setNotes] = useState(tempNotes);
  const [images, setImages] = useState([]);
  const [treeMap, setTreeMap] = useState([]);
  const [mindTree, setMindTree] = useState([]);

  useEffect(() => {
    // getNotes(setNotes);
    getImages(setImages);
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
  const note = notes[0];
  const smap = createSmap(note);

  return (
    <Layout {...props}>
      {/* <MindMap nodes={sMap.nodes} connections={sMap.connections} /> */}
      <DndProvider backend={HTML5Backend}>
        <TreeContainer>
          <DataTree nodes={treeMap} />
          <MindTree nodes={mindTree} />
        </TreeContainer>
      </DndProvider>
    </Layout>
  );
}
