import React, { useState } from "react";
import {
  Popover,
  Button,
  Intent,
  InputGroup,
  Callout,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import db from "../../../db";

export async function handleSubmit(
  { name },
  { changeData, isSubmitting, handleChange, finishedSubmitting }
) {
  const user = await db.user.toCollection().first();
  const subjectObj = {
    createdAt: +new Date(),
    name,
    // TODO: option to change the icon
    // arbitrary selection
    icon: "clean",
    x: 'center',
    y: 'center',
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
  setTimeout(() => {
    finishedSubmitting(false);
  }, 4000);
}

export default function CreateSubject({ changeData }) {
  const [submitting, isSubmitting] = useState(false);
  const [submitted, finishedSubmitting] = useState(false);
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
                { name },
                {
                  changeData,
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
          <Callout icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS}>
            All good here!
          </Callout>
        )}
      </Popover>
    </React.Fragment>
  );
}
