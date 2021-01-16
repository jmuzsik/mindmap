import React from "react";

import { Navbar, Divider } from "@blueprintjs/core";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";
// import Options from "./Options/Options";

import { SubjectLogo } from "./utils";

import "./HorizontalNav.css";

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const {
    subjectsData: { subjects, subject },
    history,
    changeData,
  } = props;

  return (
    <header className="horizontal-nav">
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>
            {subject && (
              <SubjectLogo
                {...{
                  picture: subject.picture,
                  pictureAlt: subject.pictureAlt,
                }}
              />
            )}
            <span>{subject && subject.name}</span>
          </Navbar.Heading>
          <Divider />
        </Navbar.Group>
        <Navbar.Group className="right-group">
          <CreateSubject {...{ ...props, changeData }} />
          <ChangeSubject {...{ ...props, changeData, subjects }} />
          {/* <Options {...{ userId, authInfo, setAuthInfo }} /> */}
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
