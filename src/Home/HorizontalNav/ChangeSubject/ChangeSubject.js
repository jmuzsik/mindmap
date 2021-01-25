import React from "react";
import { Popover, Button, Menu, MenuItem, Intent } from "@blueprintjs/core";

import db from "../../../db";

function createMenu({ subjects }, { changeData }) {
  return (
    <Menu>
      {subjects.map((subject, i) => (
        <MenuItem
          text={subject.name}
          onClick={() => handleOnChange({ subjects, subject }, { changeData })}
          key={subject.id || i}
        ></MenuItem>
      ))}
    </Menu>
  );
}

async function handleOnChange({ subject }, { changeData }) {
  const subjectId = subject.id;
  const notes = (await db.notes.where({ subjectId }).toArray()) || [];
  const images = (await db.images.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const structure = tree.structure;
  const user = await db.user.toCollection().first();
  await db.user.update(user.id, {
    currentSubject: subjectId
  });

  changeData({
    update: "updateSubject",
    currentSubject: subject,
    data: [notes, images],
    structure,
  });
}

export default function ChangeSubject({ changeData, subjects }) {
  return (
    <React.Fragment>
      <Popover
        popoverClassName="subject-popover"
        portalClassName="subject-popover-portal"
        position="auto"
        minimal
        enforceFocus={false}
      >
        <Button text="Change Subject" intent={Intent.PRIMARY} />
        {createMenu({ subjects }, { changeData })}
      </Popover>
    </React.Fragment>
  );
}
