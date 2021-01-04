import React, { useState, useEffect } from "react";
import {
  Popover,
  Button,
  Menu,
  MenuItem,
  Intent,
  Spinner,
} from "@blueprintjs/core";

import AuthClass from "../../../../TopLevel/Auth/Class";
import createGetOptions from "../../../../Utils/FetchOptions/Get";
import createPostOptions from "../../../../Utils/FetchOptions/Post";
import { organiseSubjects } from "../utils";

async function apiCall(
  { userId, currentSubject },
  { setSubjectsState, isloading }
) {
  const url = `/api/subject/user/${userId}`;
  const getOptions = createGetOptions();
  let subjects;
  try {
    subjects = await fetch(url, getOptions);
    subjects = await subjects.json();
  } catch (error) {
    console.log("within fetching subjects", error);
  }
  const { organisedSubjects, subject } = organiseSubjects({
    subjects,
    currentSubject,
  });
  setSubjectsState({ subjects: organisedSubjects, subject });
  isloading(false);
}

function createMenu(
  { subjects, loading, userId },
  { setSubjectsState, setSubject }
) {
  return (
    <Menu>
      {loading ? (
        <Spinner intent={Intent.NONE} size={Spinner.SIZE_STANDARD} />
      ) : (
        subjects.map((subject) => (
          <MenuItem
            onClick={() =>
              handleOnChange(
                { subjects, subject, userId },
                { setSubjectsState, setSubject }
              )
            }
            text={subject.name}
            key={subject._id}
          />
        ))
      )}
    </Menu>
  );
}

async function handleOnChange(
  { subjects, subject, userId },
  { setSubjectsState, setSubject }
) {
  console.log(userId);
  const url = `/api/users/update-subject/${userId}`;
  const postOptions = createPostOptions({ id: subject._id });
  let user;
  try {
    user = await fetch(url, postOptions);
    user = await user.json();
  } catch (error) {
    console.log("within fetching subjects", error);
  }
  AuthClass.setUser(Object.assign(AuthClass.getUser(), user));
  const subjectsObj = organiseSubjects({
    subjects,
    currentSubject: subject,
  });
  const organisedSubjects = subjectsObj.organisedSubjects;
  setSubjectsState({ subjects: organisedSubjects, subject });
  setSubject(subject);
}

export default function ChangeSubject({
  userId,
  currentSubject,
  subjectsState,
  setSubject,
  setSubjectsState,
}) {
  const [loading, isloading] = useState(true);
  console.log(subjectsState, currentSubject);
  useEffect(() => {
    apiCall({ userId, currentSubject }, { setSubjectsState, isloading });
  }, [userId, currentSubject]);

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
        {createMenu(
          { subjects: subjectsState.subjects, loading, userId },
          { setSubjectsState, setSubject }
        )}
      </Popover>
    </React.Fragment>
  );
}
