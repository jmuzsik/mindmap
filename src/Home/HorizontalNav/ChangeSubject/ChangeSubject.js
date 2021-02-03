import React from "react";
import { Button, Menu, MenuItem, Intent } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Editor from "../../../Components/Editor";

import db from "../../../db";

function createMenu({ subjects }, { changeData }) {
  return (
    <Menu>
      {subjects.map((subject, i) => (
        <MenuItem
          text={
            <Editor
              contentEditable={false}
              readOnly={true}
              editorState={subject.content}
              setEditorState={() => null}
              theme="bubble"
            />
          }
          onClick={() => handleOnChange({ subjects, subject }, { changeData })}
          key={subject.id || i}
        ></MenuItem>
      ))}
    </Menu>
  );
}

async function handleOnChange({ subject }, { changeData }) {
  const subjectId = subject.id;
  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const structure = tree.structure;
  const user = await db.user.toCollection().first();
  await db.user.update(user.id, {
    currentSubject: subjectId,
  });

  changeData({
    update: "updateSubject",
    subject,
    data: nodes,
    structure,
  });
}

export default function ChangeSubject({ changeData, subjects, names }) {
  return (
    <Popover2
      placement="bottom-end"
      autoFocus
      content={createMenu({ subjects }, { changeData })}
    >
      <Button
        text={`${names.change} ${names.subject}`}
        intent={Intent.PRIMARY}
      />
    </Popover2>
  );
}
