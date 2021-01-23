import React from "react";
import { Popover, Button, Menu, MenuItem, Intent } from "@blueprintjs/core";

import db from "../../../../db";

function createMenu({ subjects }, { changeData }) {
  return (
    <Menu>
      {subjects.map((subject, i) => (
        <MenuItem
          onClick={() => handleOnChange({ subjects, subject }, { changeData })}
          text={subject.name}
          key={subject.id || i}
        />
      ))}
    </Menu>
  );
}

async function handleOnChange({ subject }, { changeData }) {
  const users = await db.user.toArray();
  const user = users[0];
  const subjectId = user.currentSubject;
  const notes = (await db.notes.where({ subjectId })).toArray() || [];
  const images = (await db.images.where({ subjectId })).toArray() || [];
  await db.user.update(user.id, {
    currentSubject: subject.id,
  });

  changeData({
    update: "updateSubject",
    currentSubject: subject,
    data: [notes, images],
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
