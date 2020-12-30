import React, { useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Button, ButtonGroup, Card } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import RichEditor from "../../Components/Editor/Editor";
import createPostOptions from "../../Utils/FetchOptions/Post";

async function handleEditSave(
  data,
  { setLoading, setDisabled, setEditable, setNotes, idx, notes }
) {
  const id = notes[idx]._id;
  const url = `/api/note/${id}`;
  const options = createPostOptions(data, "PUT");
  let editedNote = await fetch(url, options);

  // TODO: handle error
  editedNote = await editedNote.json();
  if (!editedNote.error) {
    setLoading(false);
    setDisabled(false);
    setEditable(false);
    setNotes(
      notes.map((note, i) => {
        if (i === idx) {
          return editedNote;
        } else return note;
      })
    );
  }
}

async function handleDelete({ setNotes, idx, notes }) {
  const id = notes[idx]._id;
  const url = `/api/note/${id}`;
  const options = createPostOptions({}, "DELETE");
  let res = await fetch(url, options);

  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setNotes(notes.filter((_, i) => i !== idx));
  }
}

export default function Note(props) {
  const { notes, note, setNotes, idx } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(note.raw)))
  );
  const [editable, setEditable] = useState(false);

  return (
    <form className="note">
      <Card>
        <ButtonGroup>
          <Button
            type="button"
            intent="none"
            icon={IconNames.EDIT}
            onClick={() => setEditable(!editable)}
          >
            Edit
          </Button>
          <Button
            type="button"
            intent="danger"
            disabled={disabled}
            loading={loading}
            icon={IconNames.DELETE}
            onClick={async () => {
              setLoading(true);
              setDisabled(true);
              await handleDelete({
                setNotes,
                idx,
                notes,
              });
              // TODO: Handle error
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
        <RichEditor
          minimal={true}
          controls={editable}
          editorState={editorState}
          contentEditable={editable}
          readOnly={!editable}
          onChange={setEditorState}
        />
        {editable && (
          <Button
            type="button"
            intent="primary"
            disabled={disabled}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              setDisabled(true);
              await handleEditSave(
                convertToRaw(editorState.getCurrentContent()),
                {
                  setLoading,
                  setDisabled,
                  setEditable,
                  setNotes,
                  idx,
                  notes,
                }
              );
              // TODO: Handle error
            }}
          >
            Save
          </Button>
        )}
      </Card>
    </form>
  );
}
