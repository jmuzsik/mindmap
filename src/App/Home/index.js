import React, { useEffect } from "react";
import update from "immutability-helper";

import HorizontalNav from "./HorizontalNav/HorizontalNav";
import VerticalNav from "./VerticalNav/VerticalNav";
import MindMapContainer from "./Mindmap/Container";

import { getDim } from "./utils";

import "./Home.css";

export default function Home({
  state: { user, treeData, isOpen, settings },
  hooks: { changeData, setTreeData, setOpen, setSettings },
  extra: { mainRef },
}) {
  // Update of dimensions
  useEffect(() => {
    const dataObj = update(treeData, {
      dimensions: { $set: getDim(mainRef, isOpen) },
    });
    setTreeData(dataObj);
  }, [isOpen, user.currentSubject, mainRef, setTreeData]);

  return (
    <section className={`layout ${isOpen ? "open" : "closed"}`}>
      <HorizontalNav
        state={{ treeData, isOpen, settings }}
        hooks={{ changeData, setOpen, setSettings }}
      />
      <main ref={mainRef}>
        <VerticalNav
          state={{ isOpen, treeData, user, settings }}
          hooks={{ setOpen, changeData }}
        />
        <MindMapContainer
          state={{ treeData, settings, user }}
          changeData={changeData}
        />
      </main>
    </section>
  );
}
