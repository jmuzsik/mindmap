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

  // When user first visits the site they have no subject but
  // a subject is necessary to do anything useful on this site
  // ... so here I use this state to wait one second (to avoid
  // rendering prior to a new user object being created in the
  // db), and then render a callout to tell users to create one
  // const isFirstRun = useRef(true);
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false;
  //     return;
  //   }
  // });
  useEffect(() => {
    const dataObj = update(treeData, {
      dimensions: { $set: getDim(mainRef, isOpen) },
    });
    setTreeData(dataObj);
  }, [isOpen, userProp.currentSubject]);


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
        {!userProp.currentSubject ? (
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
