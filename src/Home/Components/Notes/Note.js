import React, { useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import RichEditor from "../../../Components/Editor/Editor";
import { removeFromTree } from "../../utils";
import db from "../../../db";

async function handleEditSave(
  raw,
  { setLoading, setDisabled, setEditable, changeData, id }
) {
  const elem = document.querySelector(`[id="${id}"] [data-contents="true"]`);
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  await db.notes.update(id, {
    height,
    width,
    raw,
  });
  const editedNote = await db.notes.get(id);

  setLoading(false);
  setDisabled(false);
  setEditable(false);
  changeData({ update: "edit", note: editedNote, type: "note" });
}

async function handleDelete({ changeData, setOpen, id }) {
  // i do this string as i need to avoid id replications btw images and notes
  const treeRemoval = await removeFromTree(`note-${id}`, null, true);

  // undefined or rejection
  await db.notes.delete(id);

  setOpen(false);
  if (treeRemoval === null) {
    changeData({ update: "delete", type: "note", id });
  } else {
    changeData({
      update: "deleteAndRemove",
      type: "note",
      id,
      structure: treeRemoval.updatedStructure,
      data: treeRemoval.data,
    });
  }
}

export default function Note(props) {
  const { note, changeData, setOpen } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(note.raw))
  );
  const [editable, setEditable] = useState(false);
    console.log(note)
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
                id: note.id,
              });
              // TODO: Handle error
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
        <RichEditor
          width={300}
          id={note.id}
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
                  convertToRaw(editorState.getCurrentContent()),
                  {
                    setLoading,
                    setDisabled,
                    setEditable,
                    id: note.id,
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
