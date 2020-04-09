import React, { useState, useEffect } from "react";
import { Select } from "antd";
import createGetOptions from "../../../../Utils/FetchOptions/Get";

const { Option } = Select;

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

function createOptions(subjects) {
  return subjects.map((subject) => {
    const { name, _id } = subject;
    return (
      <Option value={JSON.stringify(subject)} key={_id}>
        {name}
      </Option>
    );
  });
}

function handleOnChange({ subjects, value }, { setSubjectsState, setSubject }) {
  setSubjectsState({ subjects, subject: JSON.parse(value) });
  setSubject(JSON.parse(value));
}

export default function SelectWrapper({ userId, defaultSubject, setSubject }) {
  const [subjectsState, setSubjectsState] = useState({
    subject: { name: "" },
    subjects: [],
  });
  const [loading, isloading] = useState(true);

  useEffect(() => {
    apiCall({ userId, defaultSubject }, { setSubjectsState, isloading });
  }, []);

  return (
    <Select
      value={subjectsState.subject.name}
      loading={loading}
      onChange={(value) =>
        handleOnChange(
          { subjects: subjectsState.subjects, value },
          { setSubjectsState, setSubject }
        )
      }
    >
      {createOptions(subjectsState.subjects)}
    </Select>
  );
}
