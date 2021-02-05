import React, { useState } from "react";
import { Button, Classes } from "@blueprintjs/core";

import Editor from "../../../Components/Editor";

import db from "../../../db";
import { useFocusAndSet } from "../../../Hooks";

import "./Nodes.css";

async function handleSubmit(
  { content, height, width },
  { setOpen, setEditorState, changeData }
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
  setEditorState("");

  setOpen(false);
  changeData({ update: "newData", item: node });
}

export default function NewNode({
  state: { names, editor },
  hooks: { setOpen, changeData },
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
            }
          );
        }}
      >
        <Editor
          editorRef={editorRef}
          editorState={editorState}
          setEditorState={setEditorState}
          theme={editor}
        />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              type="submit"
              intent="primary"
            >
              {names.action}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
