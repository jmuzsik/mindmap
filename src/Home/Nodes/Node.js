import React, { useState, useCallback } from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import Editor from "../../Components/Editor";
import { removeFromTree } from "../utils";
import db from "../../db";

async function handleEditSave(
  { content, height, width },
  { setLoading, setDisabled, setEditable, changeData, id }
) {
  await db.nodes.update(id, {
    width,
    aspectRatio: width / height,
    content,
  });
  const editedNode = await db.nodes.get(id);

  setLoading(false);
  setDisabled(false);
  setEditable(false);
  changeData({ update: "edit", node: editedNode });
}

async function handleDelete({ changeData, setOpen, id }) {
  const treeRemoval = await removeFromTree(`node-${id}`, null, true);

  // undefined or rejection
  await db.nodes.delete(id);

  setOpen(false);
  if (treeRemoval === null) {
    changeData({ update: "delete", id });
  } else {
    changeData({
      update: "deleteAndRemove",
      id,
      structure: treeRemoval.updatedStructure,
      data: treeRemoval.data,
    });
  }
}

export default function Node(props) {
  const { node, changeData, setOpen, names, user } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(node.content);
  const [editable, setEditable] = useState(false);

  let editorRef;

  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback((node) => {
    if (node !== null) {
      node.focus(); // node = editorRef.current
      editorRef.current = node; // it is not done on it's own
    }
  }, []);

  return (
    <form className="node">
      <div className={Classes.DIALOG_BODY}>
        <ButtonGroup>
          <Button
            type="button"
            intent="none"
            icon={IconNames.EDIT}
            onClick={() => setEditable(!editable)}
          >
            {names.edit}
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
                id: node.id,
              });
              // TODO: Handle error
            }}
          >
            {names.delete}
          </Button>
        </ButtonGroup>
        <Editor
          contentEditable={editable}
          theme={editable ? user.editor : "bubble"}
          readOnly={!editable}
          editorRef={editorRef}
          editorState={editorState}
          setEditorState={setEditorState}
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
                const editor = editorRef.current.getEditor();
                const content = editor.getContents();
                const box = editor.root;
                await handleEditSave(
                  { content, height: box.clientHeight, width: box.clientWidth },
                  {
                    setLoading,
                    setDisabled,
                    setEditable,
                    id: node.id,
                    changeData,
                  }
                );
                // TODO: Handle error
              }}
            >
              {names.action}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
