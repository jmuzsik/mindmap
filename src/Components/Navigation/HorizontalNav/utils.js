import React from "react";
import { Icon } from "@blueprintjs/core";

import createGetOptions from "../../../Utils/FetchOptions/Get";

export function SubjectLogo({ picture, pictureAlt }) {
  if (picture === "default") {
    return <Icon icon="virus" alt="default subject image" />;
  } else {
    return <img src={picture} alt={pictureAlt} />;
  }
}

export async function getSubject(subjectId) {
  const url = `/api/subject/${subjectId}`;
  const getOptions = createGetOptions();
  let subject;
  try {
    subject = await fetch(url, getOptions);
  } catch (error) {
    console.log("within fetching subject by id", error);
  }
  try {
    subject = await subject.json();
  } catch (error) {
    console.log("within fetching subject by id, there is no subject!", error);
  }
  return subject;
}

export function organiseSubjects({ subjects, currentSubject }) {
  const firstSubject = subjects.filter(({ name }) => currentSubject === name);
  const otherSubjects = subjects.filter(({ name }) => currentSubject !== name);
  const organisedSubjects = firstSubject.concat(otherSubjects);
  return { organisedSubjects, subject: firstSubject[0] };
}

export async function getSubjects(currentSubject, userId) {
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
  return { subjects: organisedSubjects, subject };
}
