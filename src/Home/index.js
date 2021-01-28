import React, { useState, useEffect, useCallback, useRef } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import { useDeepEffect } from "../Utils";
import MindMapContainer from "./Mindmap/Container";

import { createCallout, getDim } from "./utils";
import {
  DEF_TREE_DATA,
  DEF_STRUCTURE_DATA,
  DEF_SUBJECT_DATA,
  DEF_SUBJECTS_DATA,
  DEF_DIMENSIONS,
  DEF_DATA_CHANGE,
} from "./defaults";
import mainFetch from "./mainFetch";

import "./Home.css";
import handleDataChange from "./handleDataChange";

export default function Home(props) {
  const userProp = props.user;
  const history = props.history;

  // Is the sidebar open?
  // I do this here as I need to keep track of the dimensions of the main content
  const [isOpen, setOpen] = useState(true);
  const open = isOpen ? "open" : "closed";

  // When user first visits the site they have no subject but
  // a subject is necessary to do anything useful on this site
  // ... so here I use this state to wait one second (to avoid
  // rendering prior to a new user object being created in the
  // db), and then render a callout to tell users to create one
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
  });

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

  console.log(treeData);
  const handleFetchItems = useCallback(async () => {
    const obj = await mainFetch(treeData, { svgRef, isOpen });
    console.log(obj);
    setTreeData(obj);
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData();
    };
  }, [handleFetchItems]);

  useDeepEffect(() => {
    const dataObj = handleDataChange(dataChange, treeData, setTreeData);
    if (dataObj === null) return;
    setTreeData(dataObj);
  }, [dataChange]);

  useEffect(() => {
    console.log(userProp, treeData)
    if (
      (treeData.dimensions.width && treeData.dimensions.height) ||
      // TODO: this is not ideal
      userProp.currentSubject === 1
    ) {
      const dataObj = update(treeData, {
        dimensions: { $set: getDim(svgRef, isOpen) },
      });
      setTreeData(dataObj);
    }
  }, [isOpen, userProp.currentSubject]);

  console.log(userProp);
  console.log(isFirstRun.current, userProp.currentSubject);
  console.log(!isFirstRun.current, !userProp.currentSubject);
  return (
    <section className={`layout ${open}`}>
      <HorizontalNav
        {...{
          ...props,
          changeData,
          user: userProp,
          subjectsData: {
            subjects: treeData.subjects,
            subject: treeData.subject,
          },
        }}
      />
      <main ref={svgRef}>
        {/* This is for when someone initially comes into the site
              - they need to create a subject */}
        {!isFirstRun.current && !userProp.currentSubject ? (
          createCallout()
        ) : (
          <React.Fragment>
            <VerticalNav
              {...{
                history,
                isOpen,
                setOpen,
                treeData,
                changeData,
                user: userProp,
              }}
            />
            <MindMapContainer treeData={treeData} changeData={changeData} />
          </React.Fragment>
        )}
      </main>
    </section>
  );
}
