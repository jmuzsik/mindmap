import React, { useState } from "react";
import {
  Popover,
  Button,
  Intent,
  InputGroup,
  Callout,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import createPostOptions from "../../../../Utils/FetchOptions/Post";
import { organiseSubjects } from "../utils";

async function apiCall(data) {
  let result;
  let url = "/api/subject";

  const options = createPostOptions(data);

  try {
    result = await fetch(url, options);
  } catch (err) {
    console.log("this should not happen", err);
    return { error: "server" };
  }
  result = await result.json();

  if (result.error) {
    return { error: "server" };
  }
  return result;
}

export async function handleSubmit(
  { authInfo, name, subjectsState },
  {
    setSubjectsState,
    setError,
    setSubject,
    setAuthInfo,
    isSubmitting,
    handleChange,
    finishedSubmitting,
  }
) {
  console.log(authInfo)
  const userId = authInfo.user._id;
  let response;
  try {
    response = await apiCall({ name, userId });
  } catch (error) {
    isSubmitting(false);
    setError(true);
  }
  if (response.error) {
    isSubmitting(false);
    setError(true);
    return;
  }
  const newSubject = response.subject;
  const user = response.user;
  const subjects = subjectsState.subjects.concat(newSubject);
  const { organisedSubjects, subject } = organiseSubjects({
    subjects,
    currentSubject: name,
  });
  setAuthInfo({ ...authInfo, user, updateUser: true });
  setSubjectsState({ subjects: organisedSubjects, subject });
  setSubject(newSubject);
  isSubmitting(false);
  handleChange("");
  finishedSubmitting(true);
  setTimeout(() => finishedSubmitting(false), 5000);
}

export default function CreateSubject({
  setSubject,
  authInfo,
  setAuthInfo,
  subjectsState,
  setSubjectsState,
}) {
  const [submitting, isSubmitting] = useState(false);
  const [submitted, finishedSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [name, handleChange] = useState("");

  return (
    <React.Fragment>
      <Popover
        popoverClassName="subject-popover"
        portalClassName="subject-popover-portal"
        position="auto"
        minimal
        enforceFocus={false}
      >
        <Button text="Create Subject" />
        {!submitted ? (
          <form
            className="create-subject"
            onSubmit={(e) => {
              e.preventDefault();
              isSubmitting(true);
              handleSubmit(
                { name, subjectsState, authInfo },
                {
                  setSubjectsState,
                  setAuthInfo,
                  setSubject,
                  setError,
                  isSubmitting,
                  handleChange,
                  finishedSubmitting,
                }
              );
            }}
          >
            <p>
              Hmm...{" "}
              <span role="img" aria-label="thinking face">
                🤔
              </span>
            </p>
            <InputGroup
              asyncControl={true}
              disabled={submitting}
              large
              leftIcon={IconNames.GIT_NEW_BRANCH}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="New Subject"
              value={name}
            />
            <Button
              type="submit"
              intent={Intent.SUCCESS}
              disabled={name.length === 0 || submitting}
              loading={submitting}
            >
              Do it
            </Button>
          </form>
        ) : (
          <Callout
            icon={error ? IconNames.ERROR : IconNames.TICK_CIRCLE}
            intent={error ? Intent.DANGER : Intent.SUCCESS}
          >
            {error ? "Something went wrong..." : "All good here!"}
          </Callout>
        )}
      </Popover>
    </React.Fragment>
  );
}
