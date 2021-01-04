import React, { useState, useEffect, useRef, useCallback } from "react";
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

//TODO: cannot select both heeaders and alignment at same time
const emptyEditor = () => EditorState.createEmpty();

async function handleSubmit(
  data,
  { setLoading, setDisabled, setOpen, setEditorState, setNotes, notes }
) {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/${id}`;
  const elem = document.querySelector('[data-contents="true"');
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  const options = createPostOptions({ raw: data, height, width });
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

  const prevItemIdRef = useRef();
  useEffect(() => {
    prevItemIdRef.current = props.authInfo.user.currentSubject;
  });
  const prevItemId = prevItemIdRef.current;

  // TODO: rewrite other useEffects as shown below
  // In a callback Hook to prevent unnecessary re-renders
  const handleFetchItems = useCallback(() => {
    getNotes(setNotes);
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
                    setNotes,
                    notes,
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
