import React, { useState, useEffect, useCallback } from "react";
import update from "immutability-helper";
import { Button, Intent, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import { UserContext } from "../../../App";

import Editor from "../../../Components/Editor";

import db from "../../../db";
import { DEF_STRUCTURE_DATA, DEF_SUBJECT_DATA } from "../../../defaults";

export async function handleSubmit(
  subjectUpdate,
  { changeData, isSubmitting, subject, structure }
) {
  const subjectId = subject.id;
  await db.subjects.update(subjectId, subjectUpdate);
  const updatedSubject = await db.subjects.get(subjectId);

  const tree = await db.trees.get({ subjectId });

  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];

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
    data: nodes,
  });
  isSubmitting(false);
}

export async function deleteSubject({
  changeData,
  subject,
  userObj: { user, setUser },
  setClosed,
}) {
  const subjectId = subject.id;

  // subject logic
  await db.subjects.delete(subjectId);
  const subjects = (await db.subjects.toArray()) || [];
  const subjectsIds = subjects.map(({ id }) => id);
  const newSubject = subjects[0] || DEF_SUBJECT_DATA;
  console.log(subjects, subjectsIds, newSubject);

  // tree logic
  const tree = await db.trees.get({ subjectId });
  await db.trees.delete(tree.id);
  const trees = (await db.trees.toArray()) || [];
  const treesIds = trees.map(({ id }) => id);
  console.log(trees, treesIds);

  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const nodesIds = nodes.map(({ id }) => id);
  console.log(nodes, nodesIds);
  await db.nodes.bulkDelete(nodesIds);

  await db.user.update(user.id, {
    currentSubject: newSubject.id,
    subjects: subjectsIds,
    trees: treesIds,
    nodes: user.nodes.filter((n) => {
      for (let i = 0; i < nodesIds.length; i++) {
        const id = nodesIds[i];
        if (id === n.id) {
          return false;
        }
      }
      return true;
    }),
  });

  const updatedUser = await db.user.get(user.id);

  // Grab additional info related to currentSubject
  const currentNodes =
    (await db.nodes.where({ subjectId: newSubject.id }).toArray()) || [];
  const currentTree = await db.trees.get({ subjectId: newSubject.id });
  const structure = currentTree?.structure || DEF_STRUCTURE_DATA;

  setUser(updatedUser);
  changeData({
    update: "deleteSubject",
    data: currentNodes,
    structure,
    subjects,
    subject: newSubject,
  });

  // Kind of hacky way to close it then have it instantly accessible
  setClosed(false);
  setTimeout(() => setClosed(undefined), 1);
}

export default function EditSubject({
  changeData,
  subject,
  structure,
  names,
  user,
}) {
  const [submitting, isSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(null);
  const [closed, setClosed] = useState(undefined);

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
    <Popover2
      autoFocus
      isOpen={closed}
      enforceFocus={false}
      content={
        <UserContext.Consumer>
          {(userObj) => (
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
                    aspectRatio: box.clientWidth / box.clientHeight,
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
                theme={user.editor}
                controls="minimal"
              />
              <ButtonGroup fill>
                <Button
                  type="submit"
                  intent={Intent.SUCCESS}
                  loading={submitting}
                >
                  {names.action}
                </Button>
                <Button
                  type="button"
                  intent={Intent.DANGER}
                  onClick={() =>
                    deleteSubject({ changeData, subject, userObj, setClosed })
                  }
                >
                  {names.delete}
                </Button>
              </ButtonGroup>
            </form>
          )}
        </UserContext.Consumer>
      }
    >
      <Button text={`${names.edit} ${names.subject}`} />
    </Popover2>
  );
}
