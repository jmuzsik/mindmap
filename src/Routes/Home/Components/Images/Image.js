import React, { useState } from "react";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import createPostOptions from "../../../../Utils/FetchOptions/Post";

async function handleDelete({ id, changeData, setOpen }) {
  const url = `/api/image/${id}`;
  const options = createPostOptions({}, "DELETE");
  let res = await fetch(url, options);

  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setOpen(false);
    changeData({ update: true });
  }
}

export default function Image(props) {
  const {
    image,
    idx,
    changeData,
    setOpen,
  } = props;

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
        <img src={image.src} alt="unknown" />
        {/* TODO: someway to add an alt/name to this data */}
      </div>
    </form>
  );
}
