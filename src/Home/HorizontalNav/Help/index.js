import React, { useState, useCallback } from "react";
import { Button, Card, Classes, Collapse, Dialog } from "@blueprintjs/core";

import Editor from "../../../Components/Editor";

import { CollapseContent } from "./utils";

import db from "../../../db";

async function updateHelp(content) {
  const help = await db.help.toCollection().first();
  await db.help.update(help.id, { content });
}

function handleClose({ editorRef, toggleOpen }) {
  const editor = editorRef.current.getEditor();
  const content = editor.getContents();
  updateHelp(content);
  toggleOpen(false);
}

export default function Help({ open, toggleOpen, names, user, help }) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [editorState, setEditorState] = useState(help?.content || "");

  let editorRef;

  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback((node) => {
    if (node !== null) {
      node.focus(); // node = editorRef.current
      editorRef.current = node; // it is not done on it's own
    }
  }, [editorRef]);

  return (
    <Dialog
      portalClassName={`${user.theme === "dark" ? "bp3-dark" : ""}`}
      isOpen={open}
      // this renders the header (i don't want any words)
      title=""
      onClosed={() => handleClose({ editorRef, toggleOpen })}
      onClose={() => handleClose({ editorRef, toggleOpen })}
      icon="help"
    >
      <div className="help">
        <div className={Classes.DIALOG_BODY}>
          <div className="confusion">
            <Button
              className="collapse-button"
              text={collapseOpen ? "👌" : "🤨"}
              onClick={() => setCollapseOpen(!collapseOpen)}
            />
          </div>
          <Collapse isOpen={collapseOpen}>
            <CollapseContent names={names} />
          </Collapse>
          <Card>
            <Editor
              editorRef={editorRef}
              editorState={editorState}
              setEditorState={setEditorState}
              theme={user.editor}
            />
          </Card>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => toggleOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
