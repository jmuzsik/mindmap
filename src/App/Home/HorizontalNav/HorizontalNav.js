import React, { useState } from "react";
import { Navbar, Button, ButtonGroup, Popover } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import EditSubject from "./EditSubject";
import EditNames from "./EditNames";
import Help from "./Help";

import { UserContext } from "../../utils";

import "./HorizontalNav.css";
import Settings from "./Settings";

export default function HorizontalNav({
  state: {
    treeData: { structure, subjects, subject, names, help },
    isOpen,
    settings,
  },
  hooks: { changeData, setOpen, setSettings },
}) {
  // Is the dialog open, popover does not necessitate extra state
  const [open, toggleOpen] = useState(false);

  const theme = settings.theme;
  return (
    <header className="horizontal-nav">
      <UserContext.Consumer>
        {({ user, setUser }) => (
          <Navbar>
            <Navbar.Group className="left-group" align="none">
              <Button
                className="sidebar-open"
                onClick={() => setOpen(!isOpen)}
                icon="menu"
                text={!isOpen ? names.content : ""}
              />
            </Navbar.Group>
            <Navbar.Group className="right-group" align="none">
              {/* This only runs when user first visits site as a subject is
                  necessary to use the site. */}
              {!user.currentSubject || user.step === 1 ? (
                <CreateSubject
                  state={{ names, user, settings }}
                  hooks={{ changeData, setUser }}
                />
              ) : (
                <Popover2
                  portalClassName={theme}
                  content={
                    <ButtonGroup vertical large className="subject-buttons">
                      <ChangeSubject
                        state={{ subjects, names, user, theme }}
                        hooks={{ changeData, setUser }}
                      />
                      <EditSubject
                        state={{ structure, subject, names, user, settings }}
                        hooks={{ changeData, setUser }}
                      />
                      <CreateSubject
                        state={{ names, user, settings }}
                        hooks={{ changeData, setUser }}
                      />
                    </ButtonGroup>
                  }
                >
                  <Button icon="lightbulb" text={names.subject} />
                </Popover2>
              )}
              <EditNames
                state={{ namesObj: names, theme }}
                hooks={{ changeData }}
              />
              <Settings state={{ settings, names }} hooks={{ setSettings }} />
              <Button icon="help" onClick={() => toggleOpen(!open)} />
              <Help
                state={{ open, names, settings, help }}
                hooks={{ toggleOpen, setUser }}
              />
            </Navbar.Group>
          </Navbar>
        )}
      </UserContext.Consumer>
    </header>
  );
}
