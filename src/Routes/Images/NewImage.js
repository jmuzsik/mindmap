import React, { useState } from "react";
import { FileInput, Button, Classes } from "@blueprintjs/core";
import axios from "axios";

import AuthClass from "../../TopLevel/Auth/Class";

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
  const id = AuthClass.getUser()._id;
  const url = `/api/image/${id}`;
  const elem = document.querySelector(".selected-image");
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  data.append("dimensions", JSON.stringify({ height, width }));
  let res = await axios.post(url, data);
  if (!res.error) {
    setLoading(false);
    setDisabled(false);
    setOpen(false);
    setImage(null);
    changeData({ newData: true, images: true });
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
