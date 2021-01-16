import React from "react";
import {
  Popover,
  Button,
  Menu,
  MenuItem,
  Intent,
} from "@blueprintjs/core";

import AuthClass from "../../../../TopLevel/Auth/Class";
import createPostOptions from "../../../../Utils/FetchOptions/Post";

function createMenu({ subjects }, { changeData }) {
  return (
    <Menu>
      {subjects.map((subject, i) => (
        <MenuItem
          onClick={() => handleOnChange({ subjects, subject }, { changeData })}
          text={subject.name}
          key={subject._id || i}
        />
      ))}
    </Menu>
  );
}

async function handleOnChange({ subject }, { changeData }) {
  const userId = AuthClass.getUser()._id;
  const url = `/api/users/update-subject/${userId}`;
  const postOptions = createPostOptions({ id: subject._id });
  try {
    await fetch(url, postOptions);
  } catch (error) {
    console.log("within fetching subjects", error);
  }
  changeData({ updateSubject: true, currentSubject: subject._id });
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
