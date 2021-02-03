import React from "react";

import { Navbar, Divider, Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import EditSubject from "./EditSubject";
import EditNames from "./EditNames";

import Editor from "../../Components/Editor";
import { UserContext } from "../../App";
import db from "../../db";

import "./HorizontalNav.css";

async function updateUserTheme({ user, setUser }, darkTheme) {
  await db.user.update(user.id, {
    theme: darkTheme ? "light" : "dark",
  });
  const updatedUser = await db.user.get(user.id);
  setUser(updatedUser);
}

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { treeData, changeData } = props;
  const { structure, subjects, subject, names } = treeData;

  return (
    <header className="horizontal-nav">
      <Navbar>
        <Navbar.Group className="left-group" align="none">
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
        <Navbar.Group className="right-group" align="none">
          <UserContext.Consumer>
            {(userObj) => (
              <React.Fragment>
                {userObj.user.currentSubject && (
                  <React.Fragment>
                    <ChangeSubject
                      {...{ ...props, changeData, subjects, names }}
                    />
                    <EditSubject
                      {...{
                        ...props,
                        changeData,
                        structure,
                        subject,
                        names,
                      }}
                    />
                  </React.Fragment>
                )}
                <CreateSubject {...{ ...props, changeData, names, userObj }} />
                <EditNames {...{ ...props, changeData, treeData }} />
                <Button
                  icon={userObj.user.theme === "dark" ? "flash" : "moon"}
                  onClick={() =>
                    updateUserTheme(userObj, userObj.user.theme === "dark")
                  }
                />
              </React.Fragment>
            )}
          </UserContext.Consumer>
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
