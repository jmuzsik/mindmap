import React, { useState } from "react";
import { convertFromRaw, EditorState } from "draft-js";
import RichEditor from "../../Components/Editor/Editor";
import {
  Button,
  Intent,
  Popover,
  PopoverInteractionKind,
  Dialog,
  Icon,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Box } from "../Tree/Box";
import { Dustbin } from "../Tree/Dustbin";
import Note from "../../Routes/Notes/Note";
import Image from "../../Routes/Images/Image";

const truncate = (s = "") => s.slice(0, 9);

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
    src: "/assets/ScfvsNscf.png",
    id: "5ff0a45c26e9d0ccef649766",
    width: 300,
    height: 300,
  },
  {
    src: "/assets/oi.png",
    id: "5ff0cb8526e9d0ccef64976a",
    width: 300,
    height: 300,
  },
  {
    src: "/assets/oi2.png",
    id: "5ff0f5c7c134bde0a504ecf9",
    width: 300,
    height: 164,
  },
];

function DialogWrapper(props) {
  const { className, icon, hook, title, isOpen, children } = props;
  return (
    <Dialog
      {...props}
      className={className}
      icon={icon}
      onClose={() => hook(false)}
      title={title}
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose={false}
      enforceFocus
      isOpen={isOpen}
      usePortal
      labelElement={<Icon icon={IconNames.SHARE} />}
    >
      {children}
    </Dialog>
  );
}

function Content(props) {
  const { i, id, data, type, hooks } = props;
  const [isOpen, setOpen] = useState(false);
  return (
    <div>
      <span className="treenode-id">{truncate(id)}</span>
      <Popover
        popoverClassName={`${type}-${i}-popover`}
        portalClassName={`${type}-${i}-portal`}
        position="auto-start"
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
      <Button intent={Intent.PRIMARY} minimal onClick={() => setOpen(true)}>
        Edit
      </Button>
      <DialogWrapper
        {...{
          className: type === "note" ? "edit-note-dialog" : "edit-image-dialog",
          icon:
            type === "note"
              ? IconNames.ANNOTATION
              : IconNames.IMAGE_ROTATE_LEFT,
          hook: setOpen,
          title: type === "note" ? "Edit Note" : "Edit Image",
          isOpen: isOpen,
        }}
      >
        {type === "note" ? (
          <Note
            note={data}
            idx={i}
            changeData={hooks.changeData}
            setOpen={setOpen}
          />
        ) : (
          <Image
            key={id}
            image={data}
            changeData={hooks.changeData}
            setOpen={setOpen}
            idx={i}
          />
        )}
      </DialogWrapper>
    </div>
  );
}
export function createTreeNode(props) {
  const { id, data, type, hooks } = props;
  return {
    label: <Box hooks={hooks} name={id} content={<Content {...props} />} />,
    id,
    hasCaret: false,
    childNodes: [],
    data,
    icon: type === "note" ? IconNames.DOCUMENT : IconNames.MEDIA,
  };
}

export function createTreeMap({ images, notes, hooks }) {
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

function createContent({ type, id, label, data }) {
  return (
    <React.Fragment>
      <span className="treenode-id">{truncate(label)}</span>
      {type ? (
        <Popover
          popoverClassName={`note-dustbin-popover`}
          portalClassName={`note-dustbin-portal`}
          intent={Intent.WARNING}
          minimal
        >
          <Button intent={Intent.PRIMARY} minimal>
            View
          </Button>
          {type &&
            (type === "note" ? (
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
            ))}
        </Popover>
      ) : null}
    </React.Fragment>
  );
}

function createDustbin({ type, id, label, data, additionalProps }) {
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, label, data })}
    />
  );
}

function createDustbinObj(state) {
  return {
    label: createDustbin(state),
    id: state.id,
    hasCaret: true,
    isExpanded: true,
    data: state.data,
    childNodes: [],
    icon:
      state.type === "note"
        ? IconNames.DOCUMENT
        : state.type === "image"
        ? IconNames.MEDIA
        : IconNames.FOLDER_CLOSE,
  };
}

export function createMindMapTreeData(mindMapTreeData) {
  return mindMapTreeData.map((state) => {
    return createDustbinObj(state);
  });
}

// https://stackoverflow.com/questions/22222599/javascript-recursive-search-in-json-object
function findNode(id, currentNode) {
  let i, currentChild, result;
  if (String(id) === String(currentNode.id)) {
    return currentNode;
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.childNodes.length; i += 1) {
      currentChild = currentNode.childNodes[i];

      // Search in the current child
      result = findNode(id, currentChild);

      // Return the result if the node has been found
      if (result !== false) {
        return result;
      }
    }

    // The node has not been found and we have no more options
    return false;
  }
}

export function handleDataChange(
  {
    treeData: { structure, data, subject, subjects },
    dataChange: { structureId, dataId },
  },
  { setTreeData, changeData }
) {
  // image or note?
  const noteOrImage =
    data[0].childNodes.filter((n) => n.id === dataId).length === 1 ? 0 : 1;
  // Get node from tree map
  const node = data[noteOrImage].childNodes.filter((n) => n.id === dataId)[0];
  // Remove node from tree map
  node.className = "hidden";
  // Update node for mind tree (ie. box becomes dustbin)
  const noteOrImageStr = noteOrImage === 0 ? "note" : "image";
  const dustbinObj = createDustbinObj({
    type: noteOrImageStr,
    id: node.id,
    label: node.id,
    data: node.data,
    additionalProps: {
      hasCaret: true,
      isExpanded: true,
      icon: "folder-close",
    },
  });
  const treeObj = {
    content: createContent({
      type: noteOrImageStr,
      id: node.id,
      label: node.id,
      data: node.data,
    }),
    id: node.id,
    fx: 100,
    fy: 100,
    width: node.data.width,
    height: node.data.height,
    nodes: [],
  };
  // Get insertion point
  // [0] as that is the top level node (it is array solely for the blueprint library)
  // TODO: no good reason to be array
  const mindMapTreeNode = findNode(structureId, structure[0]);
  console.log(structureId, structure[0])
  console.log(mindMapTreeNode)
  // push updated
  mindMapTreeNode.childNodes.push(dustbinObj);

  const mindMapStructure = createMindMapStructure(structure, subject);

  setTreeData({
    subject,
    subjects,
    data,
    structure,
    mindMapStructure,
  });
  changeData({ structureId: null, dataId: null });
}

function createNodes(nodes) {
  // use icon to distinguish - media for image
  return nodes.map(({ data, id, label, childNodes, icon }) => ({
    content: createContent({
      type: icon === "media" ? "image" : "note",
      id,
      label: data.id,
      data,
    }),
    id,
    width: data.width,
    height: data.height,
    fx: 500,
    fy: 100,
    nodes: createNodes(childNodes),
  }));
}

// https://stackoverflow.com/questions/35272533/flattening-deeply-nested-array-of-objects
function flatten(arr, parent) {
  let result = [];
  arr.forEach(function (a) {
    a.parent = parent;
    result.push(a);
    if (Array.isArray(a.childNodes)) {
      result = result.concat(flatten(a.childNodes, a.id));
    }
  });
  return result;
}

function createConnections(nodes, parent) {
  const flattenedNodes = flatten(nodes, parent);
  return flattenedNodes.map(({ id, parent }) => ({
    source: parent,
    target: id,
  }));
}

function createHeader(subject) {
  return <h1>{subject.name}</h1>;
}

export function createMindMapStructure(tree, subject) {
  const node = tree[0];
  return {
    nodes: [
      {
        content: createHeader(subject),
        data: subject,
        id: 0,
        fx: 400,
        fy: 50,
        width: 100,
        height: 100,
        nodes: createNodes(node.childNodes),
      },
    ],
    connections: createConnections(node.childNodes, node.id),
  };
}
