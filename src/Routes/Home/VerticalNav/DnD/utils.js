import React, { useState } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Note from "../../Components/Notes/Note";
import Image from "../../Components/Images/Image";
import Dialog from "../../../../Components/Dialog/Dialog";
import Popover from "../../../../Components/Popover/Popover";
import { Box } from "./Box/Box";
import { Dustbin } from "./Dustbin/Dustbin";

import { removeFromTree } from "../../requests";
import { handleStringCreation, InnerContent, aORb } from "../../utils";

const truncate = (s = "") => s.slice(0, 9);

function createContent(props) {
  const { type, id, data, label, changeData } = props;
  return (
    <React.Fragment>
      <span className="treenode-id">{handleStringCreation(label, data)}</span>
      {type === "subject" ? null : (
        <Popover {...{ type, id }}>
          <InnerContent {...{ id, data, type }} />
        </Popover>
      )}
      {type !== "subject" && (
        <Button onClick={() => removeFromTree(id, changeData)}>Remove</Button>
      )}
    </React.Fragment>
  );
}

// This and below corresponds to the notes/images of the tree
function TreeNodeContent(props) {
  const { i, id, data, type, changeData } = props;
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="data-content">
      <span className="treenode-id">{truncate(id)}</span>
      <Popover {...{ type, id }}>
        <InnerContent {...{ type, data, id }} />
      </Popover>
      <Button intent={Intent.PRIMARY} minimal onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Dialog
        {...{
          className: aORb(type, "edit-note-dialog", "edit-image-dialog"),
          icon: aORb(type, IconNames.ANNOTATION, IconNames.IMAGE_ROTATE_LEFT),
          title: aORb(type, "Edit Note", "Edit Image"),
          isOpen,
          setOpen,
        }}
      >
        {aORb(
          type,
          <Note
            note={data}
            idx={i}
            changeData={changeData}
            setOpen={setOpen}
          />,
          <Image
            key={id}
            image={data}
            changeData={changeData}
            setOpen={setOpen}
            idx={i}
          />
        )}
      </Dialog>
    </div>
  );
}

export function createTreeNode(props) {
  const { id, data, type, changeData, inTree } = props;

  const content = <TreeNodeContent {...props} />;

  return {
    label: inTree ? (
      content
    ) : (
      <Box hooks={{ changeData }} name={id} content={content} />
    ),
    id,
    hasCaret: false,
    childNodes: [],
    data,
    icon: aORb(type, IconNames.DOCUMENT, IconNames.MEDIA),
  };
}

function createDustbinObj({ state, childNodes, changeData }) {
  return {
    label: createDustbin(state, changeData),
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

function createDustbin(
  { type, id, data, label, additionalProps = {} },
  changeData
) {
  const l = type === "subject" ? label : id;
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, data, label: l, changeData })}
    />
  );
}

function recurseNested(cur, data, depth = 1, changeData) {
  for (let i = 0; i < cur.length; i++) {
    const elem = cur[i];
    const id = elem._id;
    let noteOrImage, node;
    // Find the node in image or note array
    for (let j = 0; j < data.length; j++) {
      node = data[j].find((el) => el._id === id);
      if (node) {
        noteOrImage = j;
        break;
      }
    }
    if (node) {
      const type = noteOrImage === 0 ? "note" : "image";
      // atm I only want to handle a depth of 2 in the mind map
      let jsxObj;
      if (depth === 2) {
        jsxObj = {
          label: createContent({
            type,
            id: node._id,
            data: node,
            label: node._id,
            changeData,
          }),
          id: node._id,
          hasCaret: true,
          isExpanded: true,
          data: node || {},
          childNodes: [],
          icon: aORb(
            type,
            IconNames.DOCUMENT,
            IconNames.MEDIA,
            IconNames.FOLDER_CLOSE
          ),
        };
      } else {
        jsxObj = createDustbinObj({
          state: {
            type,
            id: node._id,
            data: node,
            label: node._id,
          },
          changeData,
          childNodes: recurseNested(
            elem.childNodes,
            data,
            depth + 1,
            changeData
          ),
        });
      }
      cur[i] = jsxObj;
    }
  }
  return cur;
}

export function createTreeDustbins({ data, structure, subject, changeData }) {
  const nodes = [
    createDustbinObj({
      state: {
        type: "subject",
        label: subject.name,
        id: subject._id,
        data: subject,
      },
      changeData,
      childNodes: [],
    }),
  ];
  const structureCopy = JSON.parse(JSON.stringify(structure));
  const result = recurseNested(structureCopy[0].childNodes, data, 1, changeData);
  if (result) nodes[0].childNodes = result;

  return nodes;
}

export function createTreeBoxes({ changeData, data: [notes, images] }) {
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
        changeData,
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
        id: image._id,
        idx: id++,
        data: image,
        type: "image",
        changeData,
        inTree: image.inTree,
      })
    );
  }
  return treeNodes;
}
