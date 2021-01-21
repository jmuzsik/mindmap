import React from "react";
import { convertFromRaw, EditorState } from "draft-js";

import RichEditor from "../../Components/Editor/Editor";

const truncate = (s = "") => s.slice(0, 9);

export function handleStringCreation(label, data) {
  if (typeof label === "string") {
    return truncate(label);
  } else if (data._id) {
    return truncate(data._id);
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
          ? EditorState.createWithContent(convertFromRaw(JSON.parse(data.raw)))
          : null
      }
      contentEditable={false}
      readOnly={true}
      onChange={() => null}
    />,
    <img src={data.src} alt={id} width={data.width} height={data.height} />
  );
}
