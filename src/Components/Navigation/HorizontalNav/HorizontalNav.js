import React, { useState, useEffect, useCallback } from "react";

import { Navbar, Divider } from "@blueprintjs/core";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import { SubjectLogo, getSubject, getSubjects } from "./utils";

import AuthClass from "../../../TopLevel/Auth/Class";

import "./HorizontalNav.css";
import Options from "./Options/Options";
import { goTo } from "../utils";

const DEFAULT_SUBJECTS_STATE = {
  subject: { name: "" },
  subjects: [],
  current: {
    name: "",
    picture: "",
    pictureAlt: "",
  },
};

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { setAuthInfo, authInfo, history } = props;
  const user = AuthClass.getUser();
  const currentSubject = user.currentSubject;
  const userId = user._id;

  const [subjectsState, setSubjectsState] = useState(DEFAULT_SUBJECTS_STATE);
  const { name, picture, pictureAlt } = subjectsState.current;

  const handleFetchItems = useCallback(() => {
    (async () => {
      const subject = await getSubject(currentSubject);
      const subjects = await getSubjects(currentSubject, userId);
      setSubjectsState({
        subject: subjects.subject,
        current: subject,
        subjects: subjects.subjects,
      });
    })();
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setSubjectsState(DEFAULT_SUBJECTS_STATE);
    };
  }, []);

  // useEffect(() => {
  //   handleFetchItems();
  // }, [currentSubject]);
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
        <Navbar.Group className="right-group">
          <CreateSubject
            {...{
              authInfo,
              setAuthInfo,
              subjectsState,
              setSubjectsState,
            }}
          />
          <ChangeSubject
            {...{
              currentSubject,
              authInfo,
              setAuthInfo,
              subjectsState,
              setSubjectsState,
            }}
          />
          <Options {...{ userId, authInfo, setAuthInfo }} />
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
