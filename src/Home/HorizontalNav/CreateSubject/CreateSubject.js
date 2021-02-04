import React, { useState, useCallback, useEffect } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Editor from "../../../Components/Editor";

import db from "../../../db";

import "./CreateSubject.css";

export async function handleSubmit(
  data,
  {
    changeData,
    isSubmitting,
    setEditorState,
    user,
    setUser,
    setClosed,
    setForcedOpen,
  }
) {
  const subjectObj = {
    createdAt: +new Date(),
    x: "center",
    y: "center",
    ...data,
  };
  const subjectId = await db.subjects.add(subjectObj);
  const subject = await db.subjects.get(subjectId);
  const treeObj = {
    createdAt: +new Date(),
    subjectId,
    structure: {
      id: subjectId,
      type: "subject",
      content: data.content,
      data: subject,
      childNodes: [],
    },
  };
  const treeId = await db.trees.add(treeObj);
  const tree = await db.trees.get(treeId);
  const structure = tree.structure;
  // update user as well but no need to hold onto this data
  await db.user.update(user.id, {
    currentSubject: subjectId,
  });
  const updatedUser = await db.user.get(user.id);
  setUser(updatedUser);

  changeData({
    update: "newSubject",
    subject,
    // New subject has no associated data
    data: [],
    structure,
  });
  isSubmitting(false);
  setEditorState(null);
  // Kind of hacky way to close it then have it instantly accessible
  setClosed(false);
  setForcedOpen(false);
  setTimeout(() => {
    setClosed(undefined);
    setForcedOpen(undefined);
  }, 1);
}

export default function CreateSubject({ changeData, names, user, setUser }) {
  const [submitting, isSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(null);
  // if false, cannot open unless set, if undefined, can open without being set
  // used to close the popover after submission
  const [closed, setClosed] = useState(undefined);
  // used to force it open if user does not have a subject
  // things will break without a subject
  const [forceOpen, setForcedOpen] = useState(undefined);

  let editorRef;
  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback((node) => {
    if (node !== null) {
      node.focus(); // node = editorRef.current
      editorRef.current = node; // it is not done on it's own
    }
  }, []);

  useEffect(() => {
    if (!user.currentSubject) {
      setForcedOpen(true);
    }
  }, [user]);

  return (
    <Popover2
      autoFocus
      portalClassName="create-subject-portal"
      hasBackdrop={!user.currentSubject}
      isOpen={closed || forceOpen}
      content={
        <form
          className="create-subject"
          onSubmit={(e) => {
            e.preventDefault();
            isSubmitting(true);
            const editor = editorRef.current.getEditor();
            const content = editor.getContents();
            const box = editor.root;
            handleSubmit(
              {
                content,
                width: box.clientWidth,
                aspectRatio: box.clientWidth / box.clientHeight,
              },
              {
                changeData,
                user,
                setUser,
                isSubmitting,
                setEditorState,
                setClosed,
                setForcedOpen,
              }
            );
          }}
        >
          <Editor
            editorRef={editorRef}
            editorState={editorState}
            setEditorState={setEditorState}
            theme={user.editor}
            controls="minimal"
          />
          <Button
            type="submit"
            intent={Intent.SUCCESS}
            // disabled={content.length === 0 || submitting}
            loading={submitting}
          >
            {names.action}
          </Button>
        </form>
      }
    >
      <Button text={`${names.create} ${names.subject}`} />
    </Popover2>
  );
}
