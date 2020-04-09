import React from "react";
import { Avatar } from "antd";
import { FireTwoTone } from "@ant-design/icons";

import createGetOptions from "../../../Utils/FetchOptions/Get";

export function SubjectLogo({ picture, pictureAlt }) {
  if (picture === "default") {
    return <Avatar icon={<FireTwoTone />} alt="default subject image" />;
  } else {
    return <Avatar src={picture} alt={pictureAlt} />;
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
