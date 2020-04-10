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

export async function getSubject(subjectId, { setSubject, finishedLoading }) {
  const url = `/api/subject/${subjectId}`;
  const getOptions = createGetOptions();
  let subject;
  try {
    subject = await fetch(url, getOptions);
    subject = await subject.json();
  } catch (error) {
    console.log("within fetching subject by id", error);
  }
  setSubject(subject);
  finishedLoading(true);
}
