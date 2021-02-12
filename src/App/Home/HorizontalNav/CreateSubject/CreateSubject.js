import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Intent, Callout } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Editor from "../../../../Components/Editor";

import db from "../../../../db";
import { useFocusAndSet } from "../../../../Hooks";

import "./CreateSubject.css";

export async function handleSubmit(
  data,
  {
    state: { user, isSubmitting },
    hooks: { changeData, setUser, setEditorState, setClosed, setForcedOpen },
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
      nodeId: `subject-${subjectId}`,
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
    // To next step or do not change
    step: user.step === 1 ? 2 : user.step,
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
  // This is when there was no subject previously, which caused a forced
  // creation of a subject, the component should not get a state update
  // if so as it will no longer be rendered
  if (user.currentSubject !== "") {
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
}

export default function CreateSubject({
  state: {
    names,
    user,
    settings: { theme },
  },
  hooks: { changeData, setUser },
}) {
  const [submitting, isSubmitting] = useState(false);
  // if false, cannot open unless set, if undefined, can open without being set
  // used to close the popover after submission
  const [closed, setClosed] = useState(undefined);
  // used to force it open if user does not have a subject
  // things will break without a subject
  const [forceOpen, setForcedOpen] = useState(undefined);

  const [editorState, setEditorState] = useState(null);
  let editorRef;
  editorRef = useFocusAndSet(editorRef);

  useEffect(() => {
    if (user.step === 1) {
      setForcedOpen(true);
    }
  }, [user]);

  return (
    <Popover2
      portalClassName={`create-subject-portal ${theme}`}
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
                state: {
                  user,
                  isSubmitting,
                },
                hooks: {
                  changeData,
                  setUser,
                  setEditorState,
                  setClosed,
                  setForcedOpen,
                },
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
          {forceOpen && (
            <Callout
              intent={Intent.PRIMARY}
              icon="info-sign"
              title="Create your first subject"
            >
              A subject is the foundation of any page. You can have infinite
              subjects. Each subject can be updated or deleted.
            </Callout>
          )}
          <ButtonGroup fill large>
            <Button type="submit" intent={Intent.SUCCESS} loading={submitting}>
              {names.action}
            </Button>
          </ButtonGroup>
        </form>
      }
    >
      <Button text={`${names.create} ${names.subject}`} />
    </Popover2>
  );
}
