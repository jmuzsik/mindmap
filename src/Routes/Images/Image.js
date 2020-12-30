import React, { useState } from "react";
import { Button, ButtonGroup, Card } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import createPostOptions from "../../Utils/FetchOptions/Post";

async function handleDelete({ setImages, idx, images, id }) {
  const url = `/api/image/${id}`;
  const options = createPostOptions({}, "DELETE");
  let res = await fetch(url, options);

  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setImages(images.filter((_, i) => i !== idx));
  }
}

export default function Image(props) {
  const {
    images,
    image: { src, id },
    setImages,
    idx,
  } = props;

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <form className="image">
      <Card>
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
                setImages,
                idx,
                images,
                id
              });
              // TODO: Handle error
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
        <img src={src} alt="unknown" />
        {/* TODO: someway to add an alt/name to this data */}
      </Card>
    </form>
  );
}
