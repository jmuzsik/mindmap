import React, { useState, useEffect } from "react";
import update from "immutability-helper";
import { Popover, Button, Intent, InputGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import db from "../../../db";

function handleUpdate(e, property, updateNames) {
  const value = e.target.value;
  updateNames({ [property]: value });
}

export async function handleSubmit(names, { changeData, isSubmitting }) {
  // there is only one object of this at all times
  const currentNames = await db.names.toCollection().first();
  await db.names.update(currentNames.id, names);
  const updatedNames = await db.names.get(currentNames.id);

  changeData({
    update: "updateNames",
    names: updatedNames,
  });
  isSubmitting(false);
}

export default function EditNames({ changeData, treeData }) {
  const [submitting, isSubmitting] = useState(false);
  const [names, updateNames] = useState({
    subject: "",
    create: "",
    view: "",
    edit: "",
    change: "",
    fresh: "",
    network: "",
    dnd: "",
    settings: "",
    action: "",
  });
  const {
    subject,
    create,
    view,
    edit,
    change,
    fresh, // new
    network,
    dnd,
    settings,
    action,
  } = names;

  useEffect(() => {
    updateNames(treeData.names);
  }, [treeData.names]);

  return (
    <Popover
      popoverClassName="edit-name-popover"
      portalClassName="edit-name-popover-portal"
      position="auto"
      minimal
      enforceFocus={false}
    >
      <Button text="Edit Names" />
      <form
        className="edit-name"
        onSubmit={(e) => {
          e.preventDefault();
          isSubmitting(true);
          handleSubmit(names, {
            changeData,
            isSubmitting,
          });
        }}
      >
        <InputGroup
          asyncControl
          leftIcon={IconNames.LIGHTBULB}
          onChange={(e) => handleUpdate(e, "subject", updateNames)}
          value={subject}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.BUILD}
          onChange={(e) => handleUpdate(e, "create", updateNames)}
          value={create}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.GLOBE}
          onChange={(e) => handleUpdate(e, "view", updateNames)}
          value={view}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.EDIT}
          onChange={(e) => handleUpdate(e, "edit", updateNames)}
          value={edit}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.CHANGES}
          onChange={(e) => handleUpdate(e, "change", updateNames)}
          value={change}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.CLEAN}
          onChange={(e) => handleUpdate(e, "fresh", updateNames)}
          value={fresh}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.GLOBE_NETWORK}
          onChange={(e) => handleUpdate(e, "network", updateNames)}
          value={network}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.MOVE}
          onChange={(e) => handleUpdate(e, "dnd", updateNames)}
          value={dnd}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.SETTINGS}
          onChange={(e) => handleUpdate(e, "settings", updateNames)}
          value={settings}
        />
        <InputGroup
          asyncControl
          leftIcon={IconNames.TAKE_ACTION}
          onChange={(e) => handleUpdate(e, "action", updateNames)}
          value={action}
        />

        <Button type="submit" intent={Intent.SUCCESS} loading={submitting}>
          Update
        </Button>
      </form>
    </Popover>
  );
}
