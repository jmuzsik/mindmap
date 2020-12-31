import React, { useState, useEffect } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { Button, Card, Elevation, Collapse } from "@blueprintjs/core";
import RichEditor from "../../Components/Editor/Editor";
import createPostOptions from "../../Utils/FetchOptions/Post";
import createGetOptions from "../../Utils/FetchOptions/Get";
import AuthClass from "../../TopLevel/Auth/Class";
import Layout from "../../Components/Layout/Layout";
import Note from "./Note";

import "./Notes.css";

async function getNotes(setNotes) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/user/${id}`;
  const options = createGetOptions();
  let notes = await fetch(url, options);
  // TODO: handle error
  notes = await notes.json();
  if (!notes.error) {
    setNotes(notes);
  }
}

const emptyEditor = () => EditorState.createEmpty();

async function handleSubmit(
  data,
  { setLoading, setDisabled, setOpen, setEditorState, setNotes, notes }
) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/${id}`;
  const elem = document.querySelector(".public-DraftEditor-content");
  let height;
  if (elem) {
    height = elem.children[0].clientHeight;
  }
  const options = createPostOptions({ raw: data, height });
  let res = await fetch(url, options);
  // TODO: handle error
  res = await res.json();
  if (!res.error) {
    setLoading(false);
    setDisabled(false);
    setEditorState(emptyEditor());
    setNotes(notes.concat(res.note));
    setOpen(false);
  }
}

export default function Notes(props) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotes(setNotes);
    return () => {
      setNotes([]);
    };
  }, []);

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(emptyEditor);
  const [isOpen, setOpen] = useState(false);

  return (
    <Layout {...props}>
      <section className="notes">
        <Button onClick={() => setOpen(!isOpen)}>Create Note</Button>
        <Collapse isOpen={isOpen}>
          <Card elevation={Elevation.THREE}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setDisabled(true);
                await handleSubmit(
                  convertToRaw(editorState.getCurrentContent()),
                  {
                    setLoading,
                    setDisabled,
                    setEditorState,
                    setOpen,
                    notes,
                    setNotes,
                  }
                );
                // TODO: Handle error
              }}
            >
              <RichEditor
                controls={true}
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
            </form>
          </Card>
        </Collapse>
        {notes.map((note, i) => {
          return (
            <Note
              key={note._id}
              note={note}
              notes={notes}
              setNotes={setNotes}
              idx={i}
            />
          );
        })}
      </section>
    </Layout>
  );
}