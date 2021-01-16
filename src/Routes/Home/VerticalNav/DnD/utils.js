import React, { useState } from "react";
import { convertFromRaw, EditorState } from "draft-js";
import { Intent, Callout } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Note from "../../Components/Notes/Note";
import Image from "../../Components/Images/Image";
import Dialog from "../../../../Components/Dialog/Dialog";
import Popover from "../../../../Components/Popover/Popover";
import RichEditor from "../../../../Components/Editor/Editor";
import { Box } from "./Box/Box";
import { Dustbin } from "./Dustbin/Dustbin";

const truncate = (s = "") => s.slice(0, 9);

function aORb(type, a, b, c = null) {
  return type === "note" ? a : type === "image" ? b : c;
}

function handleStringCreation(label, data) {
  if (typeof label === "string") {
    return truncate(label);
  } else if (data._id) {
    return truncate(data._id);
  }
  return label;
}

function createContent(props) {
  const { type, id, data, label } = props;
  return (
    <React.Fragment>
      <span className="treenode-id">{handleStringCreation(label, data)}</span>
      {type === "subject" ? null : (
        <Popover {...{ type, id }}>
          <InnerContent {...{ id, data, type }} />
        </Popover>
      )}
    </React.Fragment>
  );
}

// This and below corresponds to the notes/images of the tree
function TreeNodeContent(props) {
  const { i, id, data, type, hooks } = props;
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="data-content">
      <span className="treenode-id">{truncate(id)}</span>
      <Popover {...{ type, id }}>
        <InnerContent {...{ type, data, id }} />
      </Popover>
      <Dialog
        {...{
          className: aORb(type, "edit-note-dialog", "edit-image-dialog"),
          icon: aORb(type, IconNames.ANNOTATION, IconNames.IMAGE_ROTATE_LEFT),
          title: aORb(type, "Edit Note", "Edit Image"),
          isOpen,
        }}
      >
        {aORb(
          type,
          <Note
            note={data}
            idx={i}
            changeData={hooks.changeData}
            setOpen={setOpen}
          />,
          <Image
            key={id}
            image={data}
            changeData={hooks.changeData}
            setOpen={setOpen}
            idx={i}
          />
        )}
      </Dialog>
    </div>
  );
}

function InnerContent({ type, id, data }) {
  return aORb(
    type,
    <RichEditor
      id={id}
      minimal
      controls={false}
      editorState={EditorState.createWithContent(
        convertFromRaw(JSON.parse(data.raw))
      )}
      contentEditable={false}
      readOnly={true}
      onChange={() => null}
    />,
    <img src={data.src} alt={id} width={data.width} height={data.height} />
  );
}

export function createTreeNode(props) {
  const { id, data, type, hooks, inTree } = props;
  const content = <TreeNodeContent {...props} />;
  return {
    label: inTree ? content : <Box hooks={hooks} name={id} content={content} />,
    id,
    hasCaret: false,
    childNodes: [],
    data,
    icon: aORb(type, IconNames.DOCUMENT, IconNames.MEDIA),
  };
}

// https://stackoverflow.com/questions/22222599/javascript-recursive-search-in-json-object
function findNode(id, currentNode, depth = 1) {
  let i, currentChild, result;
  if (
    // note
    String(id) === String(currentNode?.data?._id) ||
    // image
    String(id) === String(currentNode?.data?.id) ||
    //  subject
    String(id) === String(currentNode.id)
  ) {
    return [currentNode, depth];
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.childNodes.length; i += 1) {
      currentChild = currentNode.childNodes[i];

      // Search in the current child
      [result, depth] = findNode(id, currentChild, depth + 1);

      // Return the result if the node has been found
      if (result !== false) {
        return [result, depth];
      }
    }

    // The node has not been found and we have no more options
    return [false, false];
  }
}
function createDustbinObj({ state, childNodes }) {
  return {
    label: createDustbin(state),
    id: state.id,
    hasCaret: true,
    isExpanded: true,
    data: state.data ? state.data : {},
    childNodes,
    icon: aORb(
      state.type,
      IconNames.DOCUMENT,
      IconNames.MEDIA,
      IconNames.FOLDER_CLOSE
    ),
  };
}

function createDustbin({ type, id, data, label, additionalProps = {} }) {
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, data, label })}
    />
  );
}

function recurseNested(cur, data) {
  if (!cur) return;
  for (let i = 0; i < cur.childNodes.length; i++) {
    const elem = cur.childNodes[i];
    const id = elem._id;
    let noteOrImage, node;
    // Find the node in image or note array
    for (let j = 0; j < data.length; j++) {
      node = data[j].find((el) => el.id === id);
      if (node) {
        noteOrImage = j;
        break;
      }
    }

    if (node) {
      const type = noteOrImage === 0 ? "note" : "image";
      const obj = createDustbinObj({
        state: {
          type,
          id: node.id,
          data: node.data,
          label: node.id,
        },
        childNodes: recurseNested(elem.childNodes, data),
      });
      cur.childNodes.push(obj);
    }
  }
  return cur;
}

export function createTreeDustbins({ data, structure, subject }) {
  const nodes = [
    createDustbinObj({
      state: {
        type: "subject",
        label: subject.name,
        id: subject._id,
        // data: subject,
      },
      childNodes: [],
    }),
  ];
  const result = recurseNested(structure[0].childNodes[0], data);
  if (result) nodes[0].childNodes.push(result);
  return nodes;
}

export function createTreeBoxes({ hooks, data: [notes, images] }) {
  let id = 0;
  const treeNodes = [
    {
      label: "Notes",
      id: id++,
      className: "folder",
      icon: IconNames.FOLDER_CLOSE,
      hasCaret: true,
      isExpanded: true,
      childNodes: [],
    },
    {
      label: "Images",
      id: id++,
      className: "folder",
      icon: IconNames.FOLDER_CLOSE,
      hasCaret: true,
      isExpanded: true,
      childNodes: [],
    },
  ];
  for (let i = 0; i < notes.length; i++) {
    const notesFolder = treeNodes[0];
    const note = notes[i];
    notesFolder.childNodes.push(
      createTreeNode({
        i,
        id: note._id,
        idx: id++,
        data: note,
        type: "note",
        hooks,
        inTree: note.inTree,
      })
    );
  }
  for (let i = 0; i < images.length; i++) {
    const imagesFolder = treeNodes[1];
    const image = images[i];
    imagesFolder.childNodes.push(
      createTreeNode({
        i,
        id: image.id,
        idx: id++,
        data: image,
        type: "image",
        hooks,
        inTree: image.inTree,
      })
    );
  }
  return treeNodes;
}

// Something extra
export const createCallout = () => (
  <Callout intent={Intent.WARNING} title="You have no subject!">
    Please create a subject by clicking the Create Subject button above!
  </Callout>
);
