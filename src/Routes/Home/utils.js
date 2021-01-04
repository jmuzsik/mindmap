import React from "react";
import { convertFromRaw, EditorState } from "draft-js";
import RichEditor from "../../Components/Editor/Editor";
import {
  Button,
  Intent,
  Popover,
  PopoverInteractionKind,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Box } from "../../Components/Tree/Box";

export const tempNotes = [
  {
    _id: "5ff0f571c134bde0a504ecf6",
    userId: "5fe8dff2d296aee48fb860a4",
    raw:
      '{"blocks":[{"key":"eqash","text":"this","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5jg7c","text":"","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"580vn","text":"and this","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    height: 115,
    width: 229,
    subject: "5fe8e011d296aee48fb860a6",
    createdAt: "2021-01-02T22:36:33.066Z",
    __v: 0,
  },
  {
    _id: "5ff0f579c134bde0a504ecf7",
    userId: "5fe8dff2d296aee48fb860a4",
    raw:
      '{"blocks":[{"key":"65l9u","text":"I am real fine","type":"align-center","depth":0,"inlineStyleRanges":[{"offset":0,"length":14,"style":"BOLD"},{"offset":0,"length":14,"style":"ITALIC"},{"offset":0,"length":14,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
    height: 17,
    width: 229,
    subject: "5fe8e011d296aee48fb860a6",
    createdAt: "2021-01-02T22:36:41.781Z",
    __v: 0,
  },
  {
    _id: "5ff0f5a1c134bde0a504ecf8",
    userId: "5fe8dff2d296aee48fb860a4",
    raw:
      '{"blocks":[{"key":"aeo9l","text":"This is a very good quote","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4t4vj","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    height: 70,
    width: 229,
    subject: "5fe8e011d296aee48fb860a6",
    createdAt: "2021-01-02T22:37:21.556Z",
    __v: 0,
  },
];

export const tempImages = [
  {
    src: "blob:http://localhost:3000/a4e78ff6-0dd8-41c5-a835-b19b2aef8532",
    id: "5ff0a45c26e9d0ccef649766",
    width: 300,
    height: 300,
  },
  {
    src: "blob:http://localhost:3000/e88e8abc-59a9-4966-8b96-d6937e55defa",
    id: "5ff0cb8526e9d0ccef64976a",
    width: 300,
    height: 300,
  },
  {
    src: "blob:http://localhost:3000/0843de77-1566-4aad-ae89-22eb3928d68c",
    id: "5ff0f5c7c134bde0a504ecf9",
    width: 300,
    height: 164,
  },
];

function createTreeNode({ i, id, data, type, idx }) {
  return {
    label: (
      <Box
        name={id}
        content={
          <React.Fragment>
            <span className="treenode-id">{id}</span>
            <Popover
              popoverClassName={`note-${i}-popover`}
              portalClassName={`note-${i}-portal`}
              interactionKind={PopoverInteractionKind.HOVER}
              intent={Intent.WARNING}
              minimal
            >
              <Button intent={Intent.PRIMARY} minimal>
                View
              </Button>
              {type === "note" ? (
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
                />
              ) : (
                <img
                  src={data.src}
                  alt={id}
                  width={data.width}
                  height={data.height}
                />
              )}
            </Popover>
          </React.Fragment>
        }
      />
    ),
    id: idx,
    hasCaret: false,
    childNodes: [],
    icon: type === "note" ? IconNames.DOCUMENT : IconNames.MEDIA,
  };
}

export function createTreeMap({ images, notes }) {
  let id = 0;
  const treeNodes = [
    {
      label: "Notes",
      id: id++,
      className: "folder",
      icon: IconNames.FOLDER_CLOSE,
      hasCaret: true,
      childNodes: [],
    },
    {
      label: "Images",
      id: id++,
      className: "folder",
      icon: IconNames.FOLDER_CLOSE,
      hasCaret: true,
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
        data: { raw: note.raw },
        type: "note",
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
        data: { src: image.src, height: image.height, width: image.width },
        type: "image",
      })
    );
  }
  return treeNodes;
}

export function createSmap(note) {
  return {
    nodes: [
      {
        content: note ? (
          <RichEditor
            id={note._id}
            minimal={true}
            controls={false}
            editorState={EditorState.createWithContent(
              convertFromRaw(JSON.parse(note.raw))
            )}
            contentEditable={false}
            readOnly={true}
            onChange={() => null}
          />
        ) : (
          <div>oi</div>
        ),
        id: "1",
        fx: 500,
        fy: 100,
        width: 100,
        height: 100,
        nodes: [
          {
            content: <div>hey</div>,
            id: "2",
            fx: 550,
            fy: 50,
            width: 100,
            height: 100,
            nodes: [],
          },
        ],
      },
      {
        content: <div>below other and to the left</div>,
        id: "3",
        fx: 250,
        fy: 350,
        width: 100,
        height: 100,
        nodes: [],
      },
      {
        content: <div>below other and to the right</div>,
        id: "4",
        fx: 750,
        fy: 350,
        width: 100,
        height: 100,
        nodes: [],
      },
    ],
    connections: [
      {
        source: "1",
        target: "3",
      },
      {
        source: "1",
        target: "4",
      },
    ],
  };
}
