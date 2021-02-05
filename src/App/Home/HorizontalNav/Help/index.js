import React, { useState } from "react";
import { Button, Card, Classes, Collapse, Dialog } from "@blueprintjs/core";

import Editor from "../../../../Components/Editor";

import { CollapseContent } from "./utils";
import { useFocusAndSet } from "../../../../Hooks";

import db from "../../../../db";

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

export default function Help({
  state: { open, names, help, settings },
  hooks: { toggleOpen },
}) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [editorState, setEditorState] = useState(help?.content || "");

  let editorRef;
  editorRef = useFocusAndSet(editorRef);

  return (
    <Dialog
      portalClassName={settings.theme}
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
              theme={settings.editor}
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
