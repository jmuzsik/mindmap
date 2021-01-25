import React, { useState, useEffect, useCallback } from "react";

import "draft-js/dist/Draft.css";

import db from "./db";
import Home from "./Home";

const DEF_USER = {
  name: "",
  createdAt: +new Date(),
  picture: "",
  theme: "light",
  currentSubject: "",
  subjects: [],
  trees: [],
  notes: [],
  images: [],
};

function App(props) {
  const [user, setUser] = useState(DEF_USER);

  const handleFetchUser = useCallback(async () => {
    // Always will be stored as array but will only ever care about first item here
    let users = await db.user.toArray();
    // User object not created yet so create default user
    if (users.length === 0) {
      users = await db.user.add(DEF_USER);
    }
    setUser(users[0]);
  }, []);

  useEffect(() => {
    handleFetchUser();
    return () => {
      setUser(DEF_USER);
    };
  }, [setUser, handleFetchUser]);

  return (
    <div className={`${user.theme === "dark" ? "bp3-dark" : ""}`}>
      <Home {...props} />
    </div>
  );
}

export default App;
