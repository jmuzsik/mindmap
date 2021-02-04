import React from "react";
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import Editor from "../../../Components/Editor";

import db from "../../../db";

function createMenu({ subjects, user }, { changeData, setUser }) {
  return (
    <Menu className="change-subject">
      {subjects.map((subject, i) => (
        <MenuItem
          className="subject"
          text={
            <Editor
              contentEditable={false}
              readOnly={true}
              editorState={subject.content}
              setEditorState={() => null}
              theme="bubble"
            />
          }
          active={user.currentSubject === subject.id}
          onClick={() =>
            handleOnChange({ subjects, subject, user }, { changeData, setUser })
          }
          key={subject.id || i}
        ></MenuItem>
      ))}
    </Menu>
  );
}

async function handleOnChange({ subject, user }, { changeData, setUser }) {
  const subjectId = subject.id;
  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const structure = tree.structure;
  await db.user.update(user.id, {
    currentSubject: subjectId,
  });
  const updatedUser = await db.user.get(user.id);

  changeData({
    update: "updateSubject",
    subject,
    data: nodes,
    structure,
  });

  setUser(updatedUser);
}

export default function ChangeSubject({
  changeData,
  subjects,
  names,
  user,
  setUser,
}) {
  return (
    <Popover2
      autoFocus
      content={createMenu({ subjects, user }, { changeData, setUser })}
    >
      <Button text={`${names.change} ${names.subject}`} />
    </Popover2>
  );
}
