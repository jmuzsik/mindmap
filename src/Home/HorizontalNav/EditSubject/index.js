import React, { useState, useEffect, useCallback } from "react";
import update from "immutability-helper";
import { Popover, Button, Intent } from "@blueprintjs/core";

import Editor from "../../../Components/Editor";

import db from "../../../db";

export async function handleSubmit(
  subjectUpdate,
  { changeData, isSubmitting, subject, structure }
) {
  await db.subjects.update(subject.id, subjectUpdate);
  const updatedSubject = await db.subjects.get(subject.id);

  const tree = await db.trees.get({ subjectId: subject.id });

  await db.trees.update(tree.id, {
    structure: update(structure, {
      content: { $set: updatedSubject.content },
    }),
  });
  const updatedTree = await db.trees.get(tree.id);

  changeData({
    update: "updateSubject",
    subject: updatedSubject,
    structure: updatedTree.structure,
  });
  isSubmitting(false);
}

export default function EditSubject({ changeData, subject, structure }) {
  const [submitting, isSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(null);

  let editorRef;
  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback((node) => {
    if (node !== null) {
      node.focus(); // node = editorRef.current
      editorRef.current = node; // it is not done on it's own
    }
  }, []);

  useEffect(() => {
    setEditorState(subject.content);
  }, [subject.content]);

  return (
    <Popover
      popoverClassName="edit-subject-popover"
      portalClassName="edit-subject-popover-portal"
      position="auto"
      minimal
      enforceFocus={false}
    >
      <Button text="Edit Subject" />
      <form
        className="edit-subject"
        onSubmit={(e) => {
          e.preventDefault();
          isSubmitting(true);
          const editor = editorRef.current.getEditor();
          const content = editor.getContents();
          const box = editor.root;
          handleSubmit(
            {
              content,
              height: box.clientHeight,
              width: box.clientWidth,
            },
            {
              changeData,
              subject,
              structure,
              isSubmitting,
            }
          );
        }}
      >
        <Editor
          editorRef={editorRef}
          editorState={editorState}
          setEditorState={setEditorState}
          theme="snow"
          controls="minimal"
        />

        <Button type="submit" intent={Intent.SUCCESS} loading={submitting}>
          Update
        </Button>
      </form>
    </Popover>
  );
}
