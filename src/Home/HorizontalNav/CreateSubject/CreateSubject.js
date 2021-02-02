import React, { useState, useCallback } from "react";
import {
  Popover,
  Button,
  Intent,
  InputGroup,
  Callout,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { UserContext } from "../../../App";
import Editor from "../../../Components/Editor";

import db from "../../../db";

import "./CreateSubject.css";

export async function handleSubmit(
  data,
  { changeData, isSubmitting, finishedSubmitting, userObj: { user, setUser } }
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
  finishedSubmitting(true);
}

export default function CreateSubject({ changeData, names }) {
  const [submitting, isSubmitting] = useState(false);
  const [submitted, finishedSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(null);

  let editorRef;
  // This is done instead of useRef as I need to focus the element
  editorRef = useCallback((node) => {
    if (node !== null) {
      node.focus(); // node = editorRef.current
      editorRef.current = node; // it is not done on it's own
    }
  }, []);

  return (
    <Popover
      popoverClassName="subject-popover"
      portalClassName="subject-popover-portal"
      position="auto"
      minimal
      enforceFocus={false}
    >
      <Button text={`${names.create} ${names.subject}`} />
      {!submitted ? (
        <UserContext.Consumer>
          {(userObj) => (
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
                    height: box.clientHeight,
                    width: box.clientWidth,
                  },
                  {
                    changeData,
                    userObj,
                    isSubmitting,
                    finishedSubmitting,
                  }
                );
              }}
            >
              <p>
                <span role="img" aria-label="thinking face">
                  🤔
                </span>
              </p>
              <Editor
                editorRef={editorRef}
                editorState={editorState}
                setEditorState={setEditorState}
                theme="snow"
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
          )}
        </UserContext.Consumer>
      ) : (
        <Callout icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS}>
          All good here!
        </Callout>
      )}
    </Popover>
  );
}
