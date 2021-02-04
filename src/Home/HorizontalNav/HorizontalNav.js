import React, { useState } from "react";
import { Navbar, Button, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import ChangeSubject from "./ChangeSubject/ChangeSubject";
import CreateSubject from "./CreateSubject/CreateSubject";

import EditSubject from "./EditSubject";
import EditNames from "./EditNames";
import Help from "./Help";

import { UserContext } from "../../App";
import { getItem, setItem } from "../../Settings";

import "./HorizontalNav.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function aOrB(a, b, cond) {
  return cond ? b : a;
}

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav(props) {
  const { treeData, changeData, isOpen, setOpen } = props;
  const { structure, subjects, subject, names, help } = treeData;
  const [open, toggleOpen] = useState(false);

  const [theme, editor, view] = [
    getItem("theme"),
    getItem("editor"),
    getItem("view"),
  ];

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
              {!user.currentSubject && (
                <CreateSubject
                  {...{ ...props, changeData, names, user, setUser }}
                />
              )}
              <Popover2
                portalClassName={getItem("theme")}
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
                        setUser,
                      }}
                    />
                    <CreateSubject
                      {...{ ...props, changeData, names, user, setUser }}
                    />
                  </ButtonGroup>
                }
              >
                <Button icon="lightbulb" text={names.subject} />
              </Popover2>
              {/* 
                  This only runs when user first visits site as a subject is
                  necessary to use the site. 
                */}
              <EditNames {...{ ...props, changeData, treeData, user }} />
              <ErrorBoundary>
                <Popover2
                  content={
                    <ButtonGroup vertical large>
                      <Button
                        icon={aOrB("move", "globe-network", view === "dnd")}
                        text={names.view}
                        onClick={() => setItem("view")}
                      />
                      <Button
                        icon={aOrB("moon", "flash", theme === "dark")}
                        text={names.theme}
                        onClick={() => setItem("theme")}
                      />
                      <Button
                        icon={aOrB("snowflake", "tint", editor === "snow")}
                        text={names.editor}
                        onClick={() => setItem("editor")}
                      />
                    </ButtonGroup>
                  }
                >
                  <Button icon="user" text={names.settings} />
                </Popover2>
              </ErrorBoundary>
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
            </Navbar.Group>
          </Navbar>
        )}
      </UserContext.Consumer>
    </header>
  );
}
