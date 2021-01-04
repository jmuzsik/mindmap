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

async function apiCall({ currentSubject }, { setSubjectsState, isloading }) {
  const userId = AuthClass.getUser()._id;
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
  { subjects, loading, authInfo },
  { setSubjectsState, setSubject, setAuthInfo }
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
                { subjects, subject, authInfo },
                { setSubjectsState, setSubject, setAuthInfo }
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
  { subjects, subject, authInfo },
  { setSubjectsState, setSubject, setAuthInfo }
) {
  const userId = AuthClass.getUser()._id;
  const url = `/api/users/update-subject/${userId}`;
  const postOptions = createPostOptions({ id: subject._id });
  let user;
  try {
    user = await fetch(url, postOptions);
    user = await user.json();
  } catch (error) {
    console.log("within fetching subjects", error);
  }
  const newUserObj = Object.assign(AuthClass.getUser(), user, {});
  AuthClass.setUser(newUserObj);
  setAuthInfo({ ...authInfo, user: newUserObj, updateUser: true });
  const subjectsObj = organiseSubjects({
    subjects,
    currentSubject: subject,
  });
  const organisedSubjects = subjectsObj.organisedSubjects;
  setSubjectsState({ subjects: organisedSubjects, subject });
  setSubject(subject);
}

export default function ChangeSubject({
  currentSubject,
  subjectsState,
  authInfo,
  setAuthInfo,
  setSubject,
  setSubjectsState,
}) {
  const [loading, isloading] = useState(true);
  useEffect(() => {
    const userId = AuthClass.getUser()._id;
    apiCall({ userId, currentSubject }, { setSubjectsState, isloading });
  }, [currentSubject]);

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
          { subjects: subjectsState.subjects, loading, authInfo },
          { setSubjectsState, setSubject, setAuthInfo }
        )}
      </Popover>
    </React.Fragment>
  );
}
