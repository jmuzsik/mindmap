import React, { useState, useEffect } from "react";
import update from "immutability-helper";
import { Button, Intent, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Editor from "../../../../Components/Editor";

import db from "../../../../db";

import DEFAULTS from "../../../defaults";
import { useFocusAndSet } from "../../../../Hooks";

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
  user,
  setUser,
  setClosed,
}) {
  const subjectId = subject.id;

  // subject logic
  await db.subjects.delete(subjectId);
  const subjects = (await db.subjects.toArray()) || [];
  const subjectsIds = subjects.map(({ id }) => id);
  const newSubject = subjects[0] || DEFAULTS.subject;

  // tree logic
  const tree = await db.trees.get({ subjectId });
  await db.trees.delete(tree.id);
  const trees = (await db.trees.toArray()) || [];
  const treesIds = trees.map(({ id }) => id);

  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const nodesIds = nodes.map(({ id }) => id);
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
  const structure = currentTree?.structure || DEFAULTS.structure;

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
  state: {
    structure,
    subject,
    names,
    user,
    settings: { theme, editor },
  },
  hooks: { changeData, setUser },
}) {
  const [submitting, isSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(null);
  const [closed, setClosed] = useState(undefined);

  let editorRef;
  editorRef = useFocusAndSet(editorRef);

  useEffect(() => {
    setEditorState(subject.content);
  }, [subject.content]);

  return (
    <Popover2
      portalClassName={theme}
      isOpen={closed}
      content={
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
            theme="snow"
            controls="minimal"
          />
          <ButtonGroup fill>
            <Button type="submit" intent={Intent.SUCCESS} loading={submitting}>
              {names.action}
            </Button>
            <Button
              type="button"
              intent={Intent.DANGER}
              onClick={() =>
                deleteSubject({ changeData, subject, user, setUser, setClosed })
              }
            >
              {names.delete}
            </Button>
          </ButtonGroup>
        </form>
      }
    >
      <Button text={`${names.edit} ${names.subject}`} />
    </Popover2>
  );
}
