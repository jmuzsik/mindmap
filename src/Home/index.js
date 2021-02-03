import React, { useState, useEffect, useRef } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import MindMapContainer from "./Mindmap/Container";

import { createCallout, getDim } from "./utils";

import "./Home.css";

export default function Home(props) {
  const {
    changeData,
    userProp,
    treeData,
    setTreeData,
    history,
    mainRef,
    isOpen,
    open,
    setOpen,
  } = props;

  useEffect(() => {
    const dataObj = update(treeData, {
      dimensions: { $set: getDim(mainRef, isOpen) },
    });
    setTreeData(dataObj);
  }, [isOpen, userProp.currentSubject]);

  console.log(treeData);
  return (
    <section className={`layout ${open}`}>
      <HorizontalNav
        {...{
          ...props,
          changeData,
          user: userProp,
          treeData,
        }}
      />
      <main ref={mainRef}>
        {/* This is for when someone initially comes into the site
              - they need to create a subject */}
        {/* {!userProp.currentSubject ? (
          createCallout()
        ) : ( */}
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
        {/* )} */}
      </main>
    </section>
  );
}
