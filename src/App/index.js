import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast, Toaster } from "@blueprintjs/core";

import Home from "./Home";

import Skeleton from "./Skeleton";

import db from "../db";

import { useDeepEffect } from "../Hooks";
import mainFetch from "./mainFetch";
import handleDataChange from "./handleDataChange";
import { UserContext, updateUserStep } from "./utils";

import DEFAULTS from "./defaults";

function App() {
  const [loading, setLoading] = useState(true);
  // Top level user functions (also within a context object)
  const [user, setUser] = useState(DEFAULTS.user);
  // Data that persists in local storage
  const [settings, setSettings] = useState(DEFAULTS.settings);
  // Primary data of app
  const treeDefaults = {
    data: DEFAULTS.data,
    structure: DEFAULTS.structure,
    subject: DEFAULTS.subject,
    subjects: DEFAULTS.subjects,
    dimensions: DEFAULTS.dimensions,
    names: DEFAULTS.names,
    help: DEFAULTS.help,
  };
  const [treeData, setTreeData] = useState(treeDefaults);
  const [dataChange, changeData] = useState(DEFAULTS.dataChange);
  // The sidebar, used to keep track of dimensions
  const [isOpen, setOpen] = useState(true);
  // in conjunction with this
  const mainRef = useRef();
  const toasterRef = useRef();

  const handleFetchUser = useCallback(async () => {
    let users = await db.user.toArray();
    // User object not created yet so create default user
    if (users.length === 0) {
      await db.user.add(DEFAULTS.user);
      // Similar to user, only one names, help object per session
      await db.names.add(DEFAULTS.names);
      await db.help.add(DEFAULTS.help);
      return;
    }
    // There is a user
    setUser(users[0]);
  }, []);

  useEffect(() => {
    handleFetchUser();
    return () => {
      setUser(DEFAULTS.user);
    };
  }, [setUser, handleFetchUser]);

  // Both are for init data fetch
  const handleFetchItems = useCallback(async () => {
    const obj = await mainFetch(treeData);
    setTreeData(obj);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData(treeDefaults);
    };
  }, [handleFetchItems]);

  // Primary handler of change within tree data
  useDeepEffect(() => {
    const dataObj = handleDataChange(dataChange, treeData);
    // If statement occurs during first render
    if (dataObj === null) {
      return;
    }
    setTreeData(dataObj);
    return () => {
      changeData(DEFAULTS.dataChange);
    };
  }, [dataChange]);

  useDeepEffect(() => {
    if (user.step === 4) {
      toasterRef.current.show({
        icon: "info-sign",
        message: `That's that. 
         Now be sure to check out the rest of the site by clicking the buttons to the right. 
         Have fun creating! 😀`,
        intent: "success",
        timeout: 10000,
      });
      setTimeout(() => {
        toasterRef.current.clear();
      }, 10000);
      updateUserStep(5, setUser);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div
        className={`app ${settings.theme} ${
          loading ? "loading" : "finished-loading"
        }`}
      >
        {loading ? (
          <Skeleton />
        ) : (
          <Home
            state={{ user, treeData, isOpen, settings }}
            hooks={{ changeData, setTreeData, setOpen, setSettings }}
            extra={{ mainRef }}
          />
        )}
        {/* Toast stuff */}
        <Toaster usePortal={false} ref={toasterRef} />
      </div>
    </UserContext.Provider>
  );
}

export default App;
