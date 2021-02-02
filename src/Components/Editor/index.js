import React from "react";
import ReactQuill from "react-quill";

import "./Editor.css";

const createModules = (minimal) => {
  const returnObj = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
    ],
  };
  const additionalProps = [
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ];
  if (!minimal) returnObj.toolbar = returnObj.toolbar.concat(additionalProps);
  return returnObj;
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "size",
  "blockquote",
  "code",
  "list",
  "bullet",
  "link",
  "image",
  "color",
  "background",
  "font",
  "align",
];

export default function Test({
  editorRef,
  editorState,
  setEditorState,
  theme,
  readOnly,
  contentEditable,
  controls,
}) {
  const modules = createModules(controls === "minimal");
  return (
    <ReactQuill
      ref={editorRef}
      theme={theme}
      modules={modules}
      formats={formats}
      value={editorState}
      onChange={setEditorState}
      readOnly={readOnly}
      contentEditable={contentEditable}
    />
  );
}
