import React from "react";

import { Navbar, Divider } from "@blueprintjs/core";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import EditSubject from "./EditSubject";
import EditNames from "./EditNames";

import Editor from "../../Components/Editor";

import "./HorizontalNav.css";

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { treeData, changeData } = props;
  const { structure, subjects, subject, names } = treeData;

  return (
    <header className="horizontal-nav">
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>
            <Editor
              contentEditable={false}
              readOnly={true}
              editorState={subject.content}
              setEditorState={() => null}
              theme="bubble"
            />
          </Navbar.Heading>
          <Divider />
        </Navbar.Group>
        <Navbar.Group className="right-group">
          <CreateSubject {...{ ...props, changeData, names }} />
          <ChangeSubject {...{ ...props, changeData, subjects, names }} />
          <EditSubject {...{ ...props, changeData, structure, subject, names }} />
          <EditNames {...{ ...props, changeData, treeData }} />
          {/* <Options {...{ userId, authInfo, setAuthInfo }} /> */}
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
