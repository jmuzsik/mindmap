import React, { useState, useEffect } from "react";

import { Navbar, Divider } from "@blueprintjs/core";

import Search from "./Search/Search";
import ChangeSubject from "./ChangeSubject/ChangeSubject";

import { SubjectLogo, getSubject } from "./utils";

import "./HorizontalNav.css";
import Options from "./Options/Options";
import { goTo } from "../utils";

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { setAuthInfo, authInfo, history } = props;
  const { user } = authInfo;
  const defaultSubject = user.defaultSubject;
  const userId = user._id;
  // const { picture, pic tureAlt, name } = subject;
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
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading onClick={() => goTo("/", history)}>
            <SubjectLogo {...{ picture, pictureAlt }} />
            <span>{name}</span>
          </Navbar.Heading>
          <Divider />
        </Navbar.Group>
        <Navbar.Group>
          <Search />
        </Navbar.Group>
        <Navbar.Group className="right-group">
          <ChangeSubject {...{ defaultSubject, userId, setSubject }} />
          <Options {...{ userId, setAuthInfo }} />
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
