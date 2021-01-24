import React, { useState } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { Button, Classes } from "@blueprintjs/core";
import RichEditor from "../../../Components/Editor/Editor";

import db from "../../../db";

import "./Notes.css";

//TODO: cannot select both heeaders and alignment at same time
const emptyEditor = () => EditorState.createEmpty();

async function handleSubmit(
  data,
  { setLoading, setDisabled, setOpen, setEditorState, changeData }
) {
  const user = await db.user.toCollection().first();
  const elem = document.querySelector('[data-contents="true"');
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  const noteId = await db.notes.add({
    createdAt: +new Date(),
    raw: data,
    subjectId: user.currentSubject,
    height,
    width,
    inTree: false,
  });
  const note = await db.notes.get(noteId);
  setLoading(false);
  setDisabled(false);
  setEditorState(emptyEditor());

  changeData({ update: "newData", notes: true, item: note });
  setOpen(false);
}

export default function NewNote(props) {
  const setOpen = props.setOpen;
  const changeData = props.changeData;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(emptyEditor);

  return (
    <div className={`new-note ${Classes.DIALOG_BODY}`}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setDisabled(true);
          await handleSubmit(convertToRaw(editorState.getCurrentContent()), {
            setLoading,
            setDisabled,
            setEditorState,
            setOpen,
            changeData,
          });
          // TODO: Handle error
        }}
      >
        <RichEditor
          controls={true}
          editorState={editorState}
          onChange={setEditorState}
        />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button
              type="submit"
              intent="primary"
              disabled={disabled}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
