import React, { useEffect, useState } from "react";
import { Editor, convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Button, Card, Elevation } from "@blueprintjs/core";
import RichEditor from "../Components/Editor/Editor";
import createPostOptions from "../Utils/FetchOptions/Post";
import createGetOptions from "../Utils/FetchOptions/Get";
import AuthClass from "../TopLevel/Auth/Class";
import Layout from "../Components/Layout/Layout";

import "./Notes.css";

const emptyEditor = () => EditorState.createEmpty();

async function handleSubmit(
  e,
  data,
  { setLoading, setDisabled, setEditorState }
) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/${id}`;
  const options = createPostOptions(data);
  let res = await fetch(url, options);
  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setLoading(false);
    setDisabled(false);
    setEditorState(emptyEditor());
  }
}

async function getNotes(setNotes) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/user/${id}`;
  const options = createGetOptions();
  let res = await fetch(url, options);
  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setNotes(res);
  }
}
export default function Notes(props) {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(emptyEditor);
  const [notes, setNotes] = useState([]);
  const test = EditorState.createWithContent(
    convertFromRaw(convertToRaw(editorState.getCurrentContent()))
  );

  useEffect(() => {
    getNotes(setNotes);
    return () => {
      setNotes([]);
    };
  }, []);

  console.log(notes);
  console.log(notes.length > 0 && notes[0]?.raw);

  return (
    <Layout {...props}>
      <section className="notes">
        <Card elevation={Elevation.THREE}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setDisabled(true);
              const submit = await handleSubmit(
                e,
                convertToRaw(editorState.getCurrentContent()),
                { setLoading, setDisabled, setEditorState }
              );
              // TODO: Handle error
            }}
          >
            <RichEditor
              setDisabled={setDisabled}
              setLoading={setLoading}
              editorState={editorState}
              onChange={setEditorState}
            />
            <Button
              type="submit"
              intent="primary"
              disabled={disabled}
              loading={loading}
            >
              Submit
            </Button>
            {notes.length > 0 &&
              notes.map((note) => (
                <Editor
                  key={note._id}
                  contentEditable={false}
                  readOnly
                  editorState={EditorState.createWithContent(
                    convertFromRaw(JSON.parse(note.raw))
                  )}
                />
              ))}
            {/* {editorState?.getCurrentContent &&
              typeof editorState?.getCurrentContent === "function" && (
                <Editor contentEditable={false} readOnly editorState={test} />
              )} */}
          </form>
        </Card>
      </section>
    </Layout>
  );
}
