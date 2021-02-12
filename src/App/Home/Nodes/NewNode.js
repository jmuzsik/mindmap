import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Classes,
  Callout,
  Intent,
} from "@blueprintjs/core";

import Editor from "../../../Components/Editor";

import db from "../../../db";
import { useFocusAndSet } from "../../../Hooks";

import "./Nodes.css";

async function handleSubmit(
  { content, height, width },
  { setOpen, setEditorState, changeData, setUser, setForcedOpen }
) {
  const user = await db.user.toCollection().first();

  const contentId = await db.nodes.add({
    createdAt: +new Date(),
    content,
    subjectId: user.currentSubject,
    width,
    aspectRatio: width / height,
    inTree: false,
    x: "calc",
    y: "calc",
  });
  const node = await db.nodes.get(contentId);

  if (user.step === 2) {
    await db.user.update(user.id, {
      // To next step, this only runs during first visit or if help is clicked
      step: 3,
    });
    const updatedUser = await db.user.get(user.id);
    setUser(updatedUser);
    setForcedOpen(false);
  }

  setEditorState("");

  setOpen(false);
  
  changeData({ update: "newData", item: node });
}

export default function NewNode({
  state: { names, forceOpen },
  hooks: { setOpen, changeData, setUser, setForcedOpen },
}) {
  const [editorState, setEditorState] = useState("");
  let editorRef;
  editorRef = useFocusAndSet(() => editorRef);

  return (
    <div className={`new-node ${Classes.DIALOG_BODY}`}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const editor = editorRef.current.getEditor();
          const content = editor.getContents();
          const box = editor.root;
          await handleSubmit(
            { content, height: box.clientHeight, width: box.clientWidth },
            {
              setEditorState,
              setOpen,
              changeData,
              setUser,
              setForcedOpen,
            }
          );
        }}
      >
        <Editor
          editorRef={editorRef}
          editorState={editorState}
          setEditorState={setEditorState}
          theme="snow"
        />
        {forceOpen && (
          <Callout
            intent={Intent.PRIMARY}
            icon="info-sign"
            title="Create content"
          >
            Each subject has content. You can create either rich text and/or
            image(s).
          </Callout>
        )}
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <ButtonGroup large fill>
              <Button type="submit" intent="primary">
                {names.action}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
