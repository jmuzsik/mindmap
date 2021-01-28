import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  Button,
  Intent,
  InputGroup,
  Callout,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { UserContext } from "../../../App";

import db from "../../../db";

import "./CreateSubject.css";

export async function handleSubmit(
  { name },
  {
    hiddenH1Ref,
    changeData,
    isSubmitting,
    handleChange,
    finishedSubmitting,
    userObj: { user, setUser },
  }
) {
  // This text will be displayed in a future component where the
  // height/width need to be known
  const h1 = hiddenH1Ref.current;
  const [width, height] = [h1.clientWidth, h1.clientHeight];

  const subjectObj = {
    createdAt: +new Date(),
    name,
    // TODO: option to change the icon
    // arbitrary selection
    icon: "clean",
    x: "center",
    y: "center",
    height,
    width,
  };
  const subjectId = await db.subjects.add(subjectObj);
  const subject = await db.subjects.get(subjectId);
  const treeObj = {
    createdAt: +new Date(),
    subjectId,
    structure: {
      id: subjectId,
      type: "subject",
      name: subject.name,
      childNodes: [],
    },
  };
  const treeId = await db.trees.add(treeObj);
  const tree = await db.trees.get(treeId);
  const structure = tree.structure;
  // update user as well but no need to hold onto this data
  await db.user.update(user.id, {
    currentSubject: subjectId,
  });
  const updatedUser = await db.user.get(user.id);
  setUser(updatedUser);

  changeData({
    update: "newSubject",
    subject,
    // New subject has no associated data
    data: [[], []],
    structure,
  });
  isSubmitting(false);
  handleChange("");
  finishedSubmitting(true);
}

export default function CreateSubject({ changeData }) {
  const [submitting, isSubmitting] = useState(false);
  const [submitted, finishedSubmitting] = useState(false);
  const [name, handleChange] = useState("");

  const hiddenH1Ref = useRef();

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
          <UserContext.Consumer>
            {(userObj) => (
              <form
                className="create-subject"
                onSubmit={(e) => {
                  e.preventDefault();
                  isSubmitting(true);
                  handleSubmit(
                    { name },
                    {
                      hiddenH1Ref,
                      changeData,
                      userObj,
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
                  autoFocus
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
            )}
          </UserContext.Consumer>
        ) : (
          <Callout icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS}>
            All good here!
          </Callout>
        )}
      </Popover>
      <h1 ref={hiddenH1Ref} className="hidden-content">
        {name}
      </h1>
    </React.Fragment>
  );
}
