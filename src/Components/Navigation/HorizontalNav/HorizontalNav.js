import React, { useState, useEffect } from "react";

import { Navbar, Alignment, Button, Divider } from "@blueprintjs/core";

import Autocomplete from "./Autocomplete/Autocomplete";
import Select from "./Select/Select";

import { SubjectLogo, getSubject } from "./utils";

import "./HorizontalNav.css";

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav({ setAuthInfo, onLogout, authInfo }) {
  const { user } = authInfo;
  const defaultSubject = user.defaultSubject;
  const userId = user._id;
  // const { picture, pictureAlt, name } = subject;
  const [subject, setSubject] = useState({
    name: "",
    picture: "",
    pictureAlt: "",
  });
  const [loading, finishedLoading] = useState(false);
  const { name, picture, pictureAlt } = subject;

  useEffect(() => {
    getSubject(defaultSubject, { setSubject, finishedLoading });
  }, [defaultSubject]);

  return (
    <header className="horizontal-nav">
      {loading && (
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <SubjectLogo {...{ picture, pictureAlt }} />
              <span>{name}</span>
            </Navbar.Heading>
            <Divider />
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Autocomplete />
            <Select {...{ defaultSubject, userId, setSubject }} />
            <Button icon="log-out" onClick={() => onLogout(setAuthInfo)} />
          </Navbar.Group>
        </Navbar>
      )}
    </header>
  );
}
