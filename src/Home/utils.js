import React from "react";
import { convertFromRaw, EditorState } from "draft-js";

import RichEditor from "../Components/Editor/Editor";

let blobUrl = (blob) => {
  if (!blob.url) {
    blob.url = URL.createObjectURL(blob);
  }
  return blob.url;
};

export function handleStringCreation(label, data) {
  if (typeof label === "string") {
    return label;
  } else if (data.id) {
    return data.id;
  }
  return label;
}

export function aORb(type, a, b, c = null) {
  return type === "note" ? a : type === "image" ? b : c;
}

export function InnerContent({ type, id, data }) {
  return aORb(
    type,
    <RichEditor
      id={id}
      minimal
      controls={false}
      editorState={
        data.raw
          ? EditorState.createWithContent(convertFromRaw(data.raw))
          : null
      }
      contentEditable={false}
      readOnly={true}
      onChange={() => null}
    />,
    <img
      src={data.file ? blobUrl(data.file) : ""}
      alt={id}
      width={data.width}
      height={data.height}
    />
  );
}
