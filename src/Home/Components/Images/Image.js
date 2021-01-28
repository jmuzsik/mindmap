import React, { useState } from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { removeFromTree } from "../../utils";
import db from "../../../db";

let blobUrl = (blob) => {
  if (!blob.url) {
    blob.url = URL.createObjectURL(blob);
  }
  return blob.url;
};

async function handleDelete({ id, changeData, setOpen }) {
  // i do this string as i need to avoid id replications btw images and notes
  const treeRemoval = await removeFromTree(`image-${id}`, null, true);

  // undefined or rejection
  await db.images.delete(id);

  setOpen(false);
  if (treeRemoval === null) {
    changeData({ update: "delete", type: "image", id });
  } else {
    changeData({
      update: "deleteAndRemove",
      type: "image",
      id,
      structure: treeRemoval.updatedStructure,
      data: treeRemoval.data,
    });
  }
}

export default function Image(props) {
  const { image, idx, changeData, setOpen } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <form className="image">
      <div className={Classes.DIALOG_BODY}>
        <ButtonGroup>
          <Button
            type="button"
            intent="danger"
            disabled={disabled}
            loading={loading}
            icon={IconNames.DELETE}
            onClick={async () => {
              setLoading(true);
              setDisabled(true);
              await handleDelete({
                idx,
                id: image.id,
                changeData,
                setOpen,
              });
              // TODO: Handle error
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
        <img src={image.file ? blobUrl(image.file) : ""} alt="unknown" />
        {/* TODO: someway to add an alt/name to this data */}
      </div>
    </form>
  );
}
