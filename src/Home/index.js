import React, { useEffect } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import MindMapContainer from "./Mindmap/Container";

import { getDim } from "./utils";

import "./Home.css";

export default function Home(props) {
  const {
    changeData,
    user,
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
  }, [isOpen, user.currentSubject, mainRef, setTreeData]);

  return (
    <section className={`layout ${open}`}>
      <HorizontalNav
        {...{
          ...props,
          changeData,
          treeData,
        }}
      />
      <main ref={mainRef}>
        <VerticalNav
          {...{
            history,
            isOpen,
            setOpen,
            treeData,
            changeData,
            user,
          }}
        />
        <MindMapContainer treeData={treeData} changeData={changeData} />
      </main>
    </section>
  );
}
