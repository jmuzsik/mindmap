import React, { useState } from "react";
import { Button, Card, Classes, Dialog } from "@blueprintjs/core";

import Editor from "../../../../Components/Editor";

import { updateUserStep } from "../../../utils";
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
  state: { open, help, settings },
  hooks: { toggleOpen, setUser },
}) {
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
              className="step-button"
              text={`🤔? Click this for a quick walkthrough.`}
              onClick={() => {
                updateUserStep(1, setUser);
                toggleOpen(false);
              }}
            />
          </div>
          <Card>
            <Editor
              editorRef={editorRef}
              editorState={editorState}
              setEditorState={setEditorState}
              theme="snow"
            />
          </Card>
        </div>
      </div>
    </Dialog>
  );
}
