import React, { useState, useCallback } from "react";
import { Button, Classes } from "@blueprintjs/core";

import db from "../../db";
import { getItem } from "../../Settings";

import "./Nodes.css";
import Editor from "../../Components/Editor";

async function handleSubmit(
  { content, height, width },
  { setLoading, setDisabled, setOpen, setEditorState, changeData }
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
  setLoading(false);
  setDisabled(false);
  setEditorState("");

  changeData({ update: "newData", item: node });
  setOpen(false);
}

export default function NewNode({ setOpen, changeData, names, user }) {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState("");
  let editorRef;

  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback(
    (node) => {
      if (node !== null) {
        node.focus(); // node = editorRef.current
        editorRef.current = node; // it is not done on it's own
      }
    },
    [editorRef]
  );

  return (
    <div className={`new-node ${Classes.DIALOG_BODY}`}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setDisabled(true);

          const editor = editorRef.current.getEditor();
          const content = editor.getContents();
          const box = editor.root;
          await handleSubmit(
            { content, height: box.clientHeight, width: box.clientWidth },
            {
              setLoading,
              setDisabled,
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
          theme={getItem("editor")}
        />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              type="submit"
              intent="primary"
              disabled={disabled}
              loading={loading}
            >
              {names.action}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
