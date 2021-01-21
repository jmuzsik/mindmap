import React, { useState } from "react";
import { FileInput, Button, Classes } from "@blueprintjs/core";
import axios from "axios";

import createGetOptions from "../../../../Utils/FetchOptions/Get";

import AuthClass from "../../../../TopLevel/Auth/Class";

import "./Images.css";

let blobUrl = (blob) => {
  if (!blob.url) {
    blob.url = URL.createObjectURL(blob);
  }
  return blob.url;
};

function handleFileChosen(file, { setImage, setFormData, setDisabled }) {
  const formData = new FormData();
  formData.append("file", file);
  setImage(file && blobUrl(file));
  setFormData(formData);
  setDisabled(false);
}

async function submitImage(
  data,
  { setLoading, setDisabled, setOpen, setImage, changeData }
) {
  // First create image - main image object and the file
  const id = AuthClass.getUser()._id;
  let url = `/api/image/${id}`;
  // TODO: should use a react reference instead
  const elem = document.querySelector(".selected-image");
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  data.append("dimensions", JSON.stringify({ height, width }));
  let res = await axios.post(url, data);
  // Only main image object is so far returned, also need the blob to display the image
  const options = createGetOptions(null, "blob");
  let image = res.data;
  const imgId = image.imgId;
  url = `/api/image/user/${imgId}`;
  let src;
  try {
    src = await fetch(url, options);
  } catch (error) {
    // TODO: handle errorrrrrr
  }
  src = await src.blob();
  src = URL.createObjectURL(src);
  image = {
    ...image,
    src,
  };
  if (!res.error) {
    setLoading(false);
    setDisabled(false);
    setOpen(false);
    setImage(null);

    changeData({ update: "newData", images: true, image });
  }
}

export default function NewImage(props) {
  const setOpen = props.setOpen;
  const changeData = props.changeData;

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className={`new-image ${Classes.DIALOG_BODY}`}>
      <form>
        <FileInput
          inputProps={{ accept: "image/x-png,image/gif,image/jpeg" }}
          onInputChange={(e) =>
            handleFileChosen(e.target.files[0], {
              setImage,
              setFormData,
              setDisabled,
            })
          }
        />
        {image && <img className="selected-image" src={image} alt="temp" />}
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button
              type="submit"
              intent="primary"
              disabled={disabled}
              loading={loading}
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                setDisabled(true);
                await submitImage(formData, {
                  setLoading,
                  setDisabled,
                  setOpen,
                  image,
                  changeData,
                  setImage,
                });
                // TODO: Handle error
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
