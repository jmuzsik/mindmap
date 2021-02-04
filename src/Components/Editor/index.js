import React from "react";
import ReactQuill from "react-quill";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./Editor.css";

window.katex = katex;

const createModules = (minimal) => {
  const returnObj = {
    toolbar: [
      [{ size: [] }],
      [{ font: [] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ],
  };
  const additionalProps = [
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ["link", "image"],
    ["formula", "code-block"],
    ["clean"],
  ];
  if (!minimal) {
    returnObj.toolbar = returnObj.toolbar.concat(additionalProps);
  }
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
  "code-block",
  "formula",
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
