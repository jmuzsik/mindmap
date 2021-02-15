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

  await db.nodes.add({
    createdAt: +new Date(),
    content,
    subjectId: user.currentSubject,
    width,
    aspectRatio: width / height,
    inTree: false,
    x: "0",
    y: "0",
    // user zIndex is the highest current zIndex of dnd node
    zIndex: user.zIndex + 1,
  });
  // This rather than solely one to handle if there were update in DnD
  const nodes =
    (await db.nodes.where({ subjectId: user.currentSubject }).toArray()) || [];
  await db.user.update(user.id, { zIndex: user.zIndex + 1 });
  if (user.step === 2) {
    // To next step, this only runs during first visit or if help is clicked
    await db.user.update(user.id, { step: 3 });
    const updatedUser = await db.user.get(user.id);
    setUser(updatedUser);
    setForcedOpen(false);
  }

  setEditorState("");

  setOpen(false);

  changeData({ update: "setData", data: nodes });
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
