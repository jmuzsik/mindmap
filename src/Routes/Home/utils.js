import React, { useState } from "react";
import { convertFromRaw, EditorState } from "draft-js";
import RichEditor from "../../Components/Editor/Editor";
import { Button, Intent, Popover, Dialog, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Box } from "./Components/DnD/Box";
import { Dustbin } from "./Components/DnD/Dustbin";
import Note from "./Components/Notes/Note";
import Image from "./Components/Images/Image";

const truncate = (s = "") => s.slice(0, 9);
// 0 is main node, 1 is secondary, 3 is... etc
const colors = [
  "#2965CC",
  "#29A634",
  "#D99E0B",
  "#D13913",
  "#8F398F",
  "#00B3A4",
  "#DB2C6F",
  "#9BBF30",
  "#96622D",
  "#7157D9",
];

function createHeader(subject) {
  return <h1>{subject.name}</h1>;
}

export function DialogWrapper(props) {
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

function createInnerNodeContent({ type, data, id }) {
  return type === "note" ? (
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
    <img src={data.src} alt={id} width={data.width} height={data.height} />
  );
}

function Content(props) {
  const { i, id, data, type, hooks } = props;
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="data-content">
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
    links: [
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

function createInnerContent({ type, id, data }) {
  return (
    type &&
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
      <img src={data.src} alt={id} width={data.width} height={data.height} />
    ))
  );
}

function handleStringCreation(label, data, subject, init) {
  if (typeof label === "string") {
    return truncate(label);
  } else if (init) {
    return subject.name;
  } else if (data._id) {
    return truncate(data._id);
  } else {
    return subject.name;
  }
}

function createContent(props, subject, init) {
  const { type, id, data, label } = props;
  return (
    <React.Fragment>
      <span className="treenode-id">
        {handleStringCreation(label, data, subject, init)}
      </span>
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
          {createInnerContent({ id, data, type })}
        </Popover>
      ) : null}
    </React.Fragment>
  );
}

function createDustbin(
  { type, id, data, label, additionalProps },
  subject,
  init
) {
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, data, label }, subject, init)}
    />
  );
}

function createDustbinObj(state, subject, childNodes, init) {
  return {
    label: createDustbin(state, subject, init),
    id: state.id,
    hasCaret: true,
    isExpanded: true,
    data: state.data,
    childNodes: childNodes,
    icon:
      state.type === "note"
        ? IconNames.DOCUMENT
        : state.type === "image"
        ? IconNames.MEDIA
        : IconNames.FOLDER_CLOSE,
  };
}

function recurseNodes(nodes, subject) {
  return nodes.map((node) => {
    return createDustbinObj(
      node,
      subject,
      node.childNodes ? recurseNodes(node.childNodes, subject) : []
    );
  });
}

export function createMindMapTreeData(mindMapTreeData, subject) {
  const mainNode = mindMapTreeData.nodes[0];
  console.log(mainNode);
  let nodes;
  if (mainNode.childNodes) {
    nodes = [
      createDustbinObj(
        mainNode,
        subject,
        recurseNodes(mainNode.childNodes, subject, []),
        true
      ),
    ];
  } else {
    nodes = [createDustbinObj(mainNode, subject, [], true)];
  }

  return {
    nodes,
    links: mindMapTreeData.links,
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
    // init subject
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

export function handleDataChange(
  {
    treeData: { structure, data, subject, subjects, dimensions },
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
  // TODO: turn this into something undraggable but have view/edit functionality
  // ie. get rid of box jsx but keep other jsx
  // { i, id, data, type, hooks }
  const noteOrImageStr = noteOrImage === 0 ? "note" : "image";
  node.label = (
    <Content
      {...{
        id: node.id,
        data: node.data,
        hooks: { changeData },
        type: noteOrImageStr,
        i: Math.random() * 100,
      }}
    />
  );
  // Get insertion point
  // [0] as that is the top level node (it is array solely for the blueprint library)
  // TODO: no good reason to be array
  const [mindMapTreeNode, depth] = findNode(structureId, structure.nodes[0]);

  // Update node for mind tree (ie. box becomes dustbin) (max depth of 2)
  let treeObj;
  // Right now I only support a depth of 2: 0 -> 1 -> 1.1
  if (depth === 2) {
    treeObj = {
      id: node.id,
      hasCaret: false,
      isExpanded: false,
      data: node.data,
      childNodes: [],
      icon:
        noteOrImageStr === "note"
          ? IconNames.DOCUMENT
          : noteOrImageStr === "image"
          ? IconNames.MEDIA
          : IconNames.FOLDER_CLOSE,
      label: createContent({
        type: noteOrImageStr,
        id: node.id,
        data: node.data,
        label: node.id,
      }),
    };
  } else {
    treeObj = createDustbinObj({
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
  }
  // push updated
  mindMapTreeNode.childNodes.push(treeObj);

  const mindMapStructure = createMindMapStructure(structure, subject);
  console.log(structure);
  setTreeData({
    subject,
    subjects,
    data,
    structure,
    dimensions,
    mindMapStructure,
  });

  changeData({ structureId: null, dataId: null, updateTree: true });
}

const createRadius = (depth) => (depth === 1 ? 10 : 5);

function createNodes(nodes, parent) {
  // use icon to distinguish - media for image
  const flattenedNodes = flatten(nodes, parent);
  return flattenedNodes.map(({ data, id, parent, icon, depth }) => {
    const type = icon === "media" ? "image" : "note";
    return {
      jsx: createInnerNodeContent({
        type,
        id,
        data,
      }),
      depth,
      type,
      id,
      parent,
      color: pickColor("n", depth),
      radius: createRadius(depth),
      group: 0,
    };
  });
}

// https://stackoverflow.com/questions/35272533/flattening-deeply-nested-array-of-objects
function flatten(array) {
  let result = [];
  let parent = 0;
  let id = 1;
  let depth = 1;
  function inner(arr, p, i, d) {
    for (let j = 0; j < arr.length; j++) {
      const n = arr[j];
      // parent is the parent elements id
      n.parent = String(p);
      // i is either incremented from 0 (ie. 1, ...) (depth 1) or a key corresponding to
      // the parent (ie. 1.1, ..., 1.10, ...) - only 2 layers of depth
      if (d === 1) {
        n.id = String(i);
        i++;
      } else {
        const key = p + "." + j;
        n.id = key;
      }
      // this is the depth of the node ( -0- node -> ( -1- node, node -> ( -2- node)))
      n.depth = d;
      result.push(n);
      if (Array.isArray(n.childNodes) && n.childNodes.length > 0) {
        // Parent is now id of current node (child nodes of current node accesses here)
        const check = result.concat(
          inner(n.childNodes, Number(n.id), i, d + 1)
        );
        if (check[check.length - 1] !== undefined) {
          result = check;
        }
      }
    }
  }
  inner(array, parent, id, depth);
  return result;
}

function calcDistance(depth) {
  if (depth === 1) return 100;
  else return 30;
}

// just something simple/aesthetic
function pickColor(type, depth) {
  if (type === "l") {
    if (depth === 1) {
      return colors[2];
    }
    return colors[4];
  } else {
    if (depth === 1) {
      return colors[1];
    } else {
      return colors[3];
    }
  }
}

function createLinks(nodes, parent) {
  const flattenedNodes = flatten(nodes, parent);
  return flattenedNodes.map(({ id, parent, depth }) => ({
    source: parent,
    target: id,
    distance: calcDistance(depth),
    color: pickColor("l", depth),
  }));
}

export function createMindMapStructure(tree, subject) {
  const node = tree.nodes[0];
  return {
    currentId: "1",
    nodes: [
      {
        jsx: createHeader(subject),
        id: "0",
        type: "subject",
        depth: 0,
        radius: 20,
        color: colors[0],
      },
      ...createNodes(node.childNodes || [], "1"),
    ],
    links: createLinks(node.childNodes || [], "0"),
  };
}
