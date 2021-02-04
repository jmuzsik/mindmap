import React, { useState } from "react";
import { Navbar, Button, Dialog, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import EditSubject from "./EditSubject";
import EditNames from "./EditNames";
import Help from "./Help";

import { UserContext } from "../../App";
import db from "../../db";

import "./HorizontalNav.css";

function aOrB(a, b, cond) {
  return cond ? b : a;
}
async function updateUser(user, setUser, update) {
  await db.user.update(user.id, update);
  const updatedUser = await db.user.get(user.id);
  setUser(updatedUser);
}

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { treeData, changeData } = props;
  const { structure, subjects, subject, names, help } = treeData;
  const [open, toggleOpen] = useState(false);

  return (
    <header className="horizontal-nav">
      <Navbar>
        <Navbar.Group className="right-group" align="none">
          <UserContext.Consumer>
            {({ user, setUser }) => (
              <React.Fragment>
                {/* 
                  This only runs when user first visits site as a subject is
                  necessary to use the site. 
                */}
                {!user.currentSubject && (
                  <CreateSubject
                    {...{ ...props, changeData, names, user, setUser }}
                  />
                )}
                <Popover2
                  placement="bottom-end"
                  content={
                    <ButtonGroup vertical large className="subject-buttons">
                      <ChangeSubject
                        {...{
                          ...props,
                          changeData,
                          subjects,
                          names,
                          user,
                          setUser,
                        }}
                      />
                      <EditSubject
                        {...{
                          ...props,
                          changeData,
                          structure,
                          subject,
                          names,
                          user,
                        }}
                      />
                      <CreateSubject
                        {...{ ...props, changeData, names, user, setUser }}
                      />
                    </ButtonGroup>
                  }
                >
                  <Button icon="lightbulb" />
                </Popover2>
                <EditNames {...{ ...props, changeData, treeData }} />
                <Popover2
                  placement="bottom-end"
                  content={
                    <ButtonGroup vertical large>
                      <Button
                        icon={aOrB(
                          "move",
                          "globe-network",
                          user.view === "dnd"
                        )}
                        onClick={() =>
                          updateUser(user, setUser, {
                            view: aOrB("dnd", "network", user.view === "dnd"),
                          })
                        }
                      />
                      <Button
                        icon={aOrB("flash", "moon", user.theme === "dark")}
                        onClick={() =>
                          updateUser(user, setUser, {
                            theme: aOrB("dark", "light", user.theme === "dark"),
                          })
                        }
                      />
                      <Button
                        icon={aOrB("snowflake", "tint", user.editor === "snow")}
                        onClick={() =>
                          updateUser(user, setUser, {
                            editor: aOrB(
                              "snow",
                              "bubble",
                              user.editor === "snow"
                            ),
                          })
                        }
                      />
                    </ButtonGroup>
                  }
                >
                  <Button icon="user" />
                </Popover2>
                <Button icon="help" onClick={() => toggleOpen(!open)} />
                <Help
                  {...{
                    open,
                    toggleOpen,
                    names,
                    user,
                    help,
                  }}
                />
              </React.Fragment>
            )}
          </UserContext.Consumer>
        </Navbar.Group>
      </Navbar>
    </header>
  );
}
