import React, { useState } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Note from "../../Components/Notes/Note";
import Image from "../../Components/Images/Image";
import Dialog from "../../../Components/Dialog/Dialog";
import Popover from "../../../Components/Popover/Popover";
import { Box } from "./Box";
import { Dustbin } from "./Dustbin";

import { removeFromTree } from "../../utils";
import { handleStringCreation, InnerContent, aORb } from "../../utils";

function createContent(props) {
  const { type, id, data, label, changeData } = props;
  return (
    <React.Fragment>
      <span className="treenode-id">{handleStringCreation(label, data)}</span>
      {type !== "subject" && (
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
      <span className="treenode-id">{id}</span>
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
      <Box hooks={{ changeData }} name={`${type}-${id}`} content={content} />
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
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, data, label, changeData })}
    />
  );
}

function recurseNested(cur, data, depth = 1, changeData) {
  for (let i = 0; i < cur.length; i++) {
    const elem = cur[i];
    const noteOrImage = elem.type === "note" ? 0 : 1;
    const node = data[noteOrImage].find((el) => el.id === elem.id);
    const id = `${elem.type}-${node.id}`;
    // Find the node in image or note array
    // atm I only want to handle a depth of 2 in the mind map
    let jsxObj;
    if (depth === 2) {
      // No children allowed atm for children of depth 2
      jsxObj = {
        label: createContent({
          type: elem.type,
          id,
          data: node,
          label: elem.id,
          changeData,
        }),
        id,
        hasCaret: true,
        isExpanded: true,
        data: node || {},
        childNodes: [],
        icon: aORb(
          elem.type,
          IconNames.DOCUMENT,
          IconNames.MEDIA,
          IconNames.FOLDER_CLOSE
        ),
      };
    } else {
      // Max of 4 children for depth of 1
      if (elem.childNodes.length < 4) {
        jsxObj = createDustbinObj({
          state: {
            type: elem.type,
            id,
            data: node,
            label: elem.id,
          },
          changeData,
          childNodes: recurseNested(
            elem.childNodes,
            data,
            depth + 1,
            changeData
          ),
        });
      } else {
        jsxObj = {
          label: createContent({
            type: elem.type,
            id,
            data: node,
            label: elem.id,
            changeData,
          }),
          id: elem.id,
          hasCaret: true,
          isExpanded: true,
          data: elem.data ? elem.data : {},
          childNodes: recurseNested(
            elem.childNodes,
            data,
            depth + 1,
            changeData
          ),
          icon: aORb(
            elem.type,
            IconNames.DOCUMENT,
            IconNames.MEDIA,
            IconNames.FOLDER_CLOSE
          ),
        };
      }
    }
    cur[i] = jsxObj;
  }
  return cur;
}

export function createTreeDustbins({ data, structure, subject, changeData }) {
  // Max of 8 children
  const structureCopy = JSON.parse(JSON.stringify(structure));
  let nodes;
  if (structureCopy.childNodes.length < 8) {
    nodes = [
      createDustbinObj({
        state: {
          type: "subject",
          label: subject.name,
          id: `subject-${subject.id}`,
          data: subject,
        },
        changeData,
        childNodes: [],
      }),
    ];
  } else {
    nodes = [
      {
        label: <span className="treenode-id">{subject.name}</span>,
        id: subject.id,
        hasCaret: true,
        isExpanded: true,
        data: subject,
        childNodes: [],
        icon: aORb(
          "subject",
          IconNames.DOCUMENT,
          IconNames.MEDIA,
          IconNames.FOLDER_CLOSE
        ),
      },
    ];
  }
  let result;
  if (structureCopy) {
    result = recurseNested(structureCopy.childNodes, data, 1, changeData);
  }
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
        id: note.id,
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
        id: image.id,
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
