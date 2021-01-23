import React, { useState } from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import createPostOptions from "../../../../Utils/FetchOptions/Post";
import { removeFromTree } from "../../requests";

let blobUrl = (blob) => {
  if (!blob.url) {
    blob.url = URL.createObjectURL(blob);
  }
  return blob.url;
};

async function handleDelete({ imgId, id, changeData, setOpen }) {
  const treeRemoval = await removeFromTree(id, null, true);

  const url = `/api/image/${imgId}`;
  const options = createPostOptions({}, "DELETE");
  let res = await fetch(url, options);

  // TODO: handle error
  res = await res.json();
  if (!res.error) {
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
                imgId: image.imgId,
                id: image._id,
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
