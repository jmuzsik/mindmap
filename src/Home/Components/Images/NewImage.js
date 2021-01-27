import React, { useState } from "react";
import { FileInput, Button, Classes } from "@blueprintjs/core";

import db from "../../../db";

import "./Images.css";

let blobUrl = (blob) => {
  if (!blob.url) {
    blob.url = URL.createObjectURL(blob);
  }
  return blob.url;
};

function handleFileChosen(file, { setImage, setImageData, setDisabled }) {
  setImage(file && blobUrl(file));
  setImageData(file);
  setDisabled(false);
}

async function submitImage(
  data,
  { setLoading, setDisabled, setOpen, setImage, changeData }
) {
  // First create image - main image object and the file
  const user = await db.user.toCollection().first();
  // TODO: should use a react reference instead
  const elem = document.querySelector(".selected-image");
  const height = elem.clientHeight;
  const width = elem.clientWidth;

  // Only main image object is so far returned, also need the blob to display the image

  const imgId = await db.images.add({
    createdAt: +new Date(),
    file: data,
    subjectId: user.currentSubject,
    // Width of 250 is max at the beginning, so need to fix aspect ratio for height
    height: width > 250 ? height / (width / 250) : height,
    width: width > 250 ? 250 : width,
    inTree: false,
    x: "calc",
    y: "calc",
  });
  const image = await db.images.get(imgId);
  console.log(image);
  setLoading(false);
  setDisabled(false);
  setOpen(false);
  setImage(null);

  changeData({ update: "newData", images: true, item: image });
}

export default function NewImage(props) {
  const setOpen = props.setOpen;
  const changeData = props.changeData;

  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
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
              setImageData,
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
                await submitImage(imageData, {
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
