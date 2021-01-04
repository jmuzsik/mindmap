import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileInput,
  Button,
  Card,
  Elevation,
  Collapse,
} from "@blueprintjs/core";
import axios from "axios";
import createGetOptions from "../../Utils/FetchOptions/Get";
import AuthClass from "../../TopLevel/Auth/Class";
import Layout from "../../Components/Layout/Layout";
import Image from "./Image";

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
  { setLoading, setDisabled, setOpen, setImages, images, setImage, image }
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
    setImages(images.concat({ id: res.data.imgId, src: image }));
    setOpen(false);
    setImage(null);
  }
}

async function getImages(setImages) {
  const id = AuthClass.getUser()._id;
  let url = `/api/image/${id}`;
  let options = createGetOptions();
  let images;
  try {
    images = await fetch(url, options);
  } catch (error) {
    // TODO: handle this
  }
  images = await images.json();

  const finalArray = [];
  options = createGetOptions(null, "blob");
  for (let i = 0; i < images.length; i++) {
    const idx = images[i].imgId;
    url = `/api/image/user/${idx}`;
    let image;
    try {
      image = await fetch(url, options);
    } catch (error) {
      // TODO: handle errorrrrrr
    }
    image = await image.blob();
    image = URL.createObjectURL(image);
    finalArray.push({ src: image, id: idx });
  }
  setImages(finalArray);
}

export default function Images(props) {
  const [images, setImages] = useState([]);

  const prevItemIdRef = useRef();
  useEffect(() => {
    prevItemIdRef.current = props.authInfo.user.currentSubject;
  });
  const prevItemId = prevItemIdRef.current;
  // TODO: rewrite other useEffects as shown below
  // In a callback Hook to prevent unnecessary re-renders
  const handleFetchItems = useCallback(() => {
    getImages(setImages);
  }, []);

  // Fetch items on mount
  useEffect(() => {
    handleFetchItems();
  }, []);

  // I want this effect to run only when 'props.itemId' changes,
  // not when 'items' changes
  useEffect(() => {
    if (prevItemId !== props.authInfo.user.currentSubject) {
      handleFetchItems();
    }

    // keeping this for future reference
    // if (items) {
    //   const item = items.find(item => item.id === props.itemId);
    //   console.log("Item changed to " item.name);
    // }
  }, [props.authInfo.user.currentSubject]);
  // }, [ items, props.itemId ])

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  return (
    <Layout {...props}>
      <section className="images">
        <Button onClick={() => setOpen(!isOpen)}>Add Image</Button>
        <Collapse isOpen={isOpen}>
          <Card elevation={Elevation.THREE}>
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
              {image && (
                <img className="selected-image" src={image} alt="temp" />
              )}
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
                    images,
                    setImages,
                    setImage,
                  });
                  // TODO: Handle error
                }}
              >
                Submit
              </Button>
            </form>
          </Card>
        </Collapse>
        {images.map((image, i) => {
          return (
            <Image
              key={image.id}
              image={image}
              images={images}
              setImages={setImages}
              idx={i}
            />
          );
        })}
      </section>
    </Layout>
  );
}
