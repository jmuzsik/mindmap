import React, { useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import RichEditor from "../../Components/Editor/Editor";
import createPostOptions from "../../Utils/FetchOptions/Post";

async function handleEditSave(
  data,
  { setLoading, setDisabled, setEditable, changeData, id }
) {
  const url = `/api/note/${id}`;
  const elem = document.querySelector(`[id="${id}"] [data-contents="true"]`);
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  data.height = height;
  data.width = width;
  const options = createPostOptions(data, "PUT");
  let editedNote = await fetch(url, options);

  // TODO: handle error
  editedNote = await editedNote.json();
  if (!editedNote.error) {
    setLoading(false);
    setDisabled(false);
    setEditable(false);
    changeData({ update: true });
  }
}

async function handleDelete({ changeData, setOpen, id }) {
  const url = `/api/note/${id}`;
  const options = createPostOptions({}, "DELETE");
  let res = await fetch(url, options);

  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setOpen(false);
    changeData({ update: true });
  }
}

export default function Note(props) {
  const { note, changeData, setOpen, idx } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(note.raw)))
  );
  const [editable, setEditable] = useState(false);

  return (
    <form className="note">
      <div className={Classes.DIALOG_BODY}>
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
                changeData,
                setOpen,
                idx,
                id: note._id,
              });
              // TODO: Handle error
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
        <RichEditor
          id={note._id}
          minimal={true}
          controls={editable}
          editorState={editorState}
          contentEditable={editable}
          readOnly={!editable}
          onChange={setEditorState}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
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
                  { raw: convertToRaw(editorState.getCurrentContent()) },
                  {
                    setLoading,
                    setDisabled,
                    setEditable,
                    id: note._id,
                    idx,
                    changeData,
                  }
                );
                // TODO: Handle error
              }}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
