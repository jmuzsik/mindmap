import React, { useState, useEffect } from "react";
import {
  Popover,
  Button,
  Menu,
  MenuItem,
  Intent,
  Spinner,
} from "@blueprintjs/core";

import createGetOptions from "../../../../Utils/FetchOptions/Get";

function organiseSubjects({ subjects, defaultSubject }) {
  const firstSubject = subjects.filter(({ _id }) => defaultSubject === _id);
  const otherSubjects = subjects.filter(({ _id }) => defaultSubject !== _id);
  const organisedSubjects = firstSubject.concat(otherSubjects);
  return { organisedSubjects, subject: firstSubject[0] };
}

async function apiCall(
  { userId, defaultSubject },
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
    defaultSubject,
  });
  setSubjectsState({ subjects: organisedSubjects, subject });
  isloading(false);
}

function createMenu({ subjects, loading }, { setSubjectsState, setSubject }) {
  return (
    <Menu>
      {loading ? (
        <Spinner
          intent={Intent.NONE}
          size={Spinner.SIZE_STANDARD}
        />
      ) : (
        subjects.map((subject) => (
          <MenuItem
            onClick={() =>
              handleOnChange(
                { subjects, subject: JSON.stringify(subject) },
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

function handleOnChange(
  { subjects, subject },
  { setSubjectsState, setSubject }
) {
  setSubjectsState({ subjects, subject: JSON.parse(subject) });
  setSubject(JSON.parse(subject));
}

export default function ChangeSubject({ userId, defaultSubject, setSubject }) {
  const [subjectsState, setSubjectsState] = useState({
    subject: { name: "" },
    subjects: [],
  });

  const [loading, isloading] = useState(true);

  useEffect(() => {
    apiCall({ userId, defaultSubject }, { setSubjectsState, isloading });
  }, [userId, defaultSubject]);

  return (
    <React.Fragment>
      <Popover
        popoverClassName="subject-popover"
        portalClassName="subject-popover-portal"
        position="auto"
        minimal
        enforceFocus={false}
      >
        <Button text="Change Subject" />
        {createMenu(
          { subjects: subjectsState.subjects, loading },
          { setSubjectsState, setSubject }
        )}
      </Popover>
    </React.Fragment>
  );
}
