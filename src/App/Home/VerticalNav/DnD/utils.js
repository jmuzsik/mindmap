import React, { useState } from "react";
import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import Node from "../../Nodes/Node";
import Dialog from "../../../../Components/Dialog";
import Popover from "../../../../Components/Popover";
import Editor from "../../../../Components/Editor";

import { Box } from "./Box";
import { Dustbin } from "./Dustbin";

import { removeFromTree } from "../../utils";
import { handleStringCreation, InnerContent, aORb } from "../../utils";

function createContent(props) {
  const { type, id, data, label, changeData, names } = props;
  return (
    <React.Fragment>
      {type === "subject" ? (
        <Editor
          contentEditable={false}
          readOnly={true}
          editorState={data.content}
          setEditorState={() => null}
          theme="bubble"
        />
      ) : (
        <span className="treenode-id">{handleStringCreation(label, data)}</span>
      )}
      {type !== "subject" && (
        <Popover {...{ type, id, names, className: "view-content" }}>
          <InnerContent {...{ id, data, type }} />
        </Popover>
      )}
      {type !== "subject" && (
        <Button onClick={() => removeFromTree(id, changeData)}>
          {names.remove}
        </Button>
      )}
    </React.Fragment>
  );
}

// This and below corresponds to the nodes of the tree
function TreeNodeContent({ i, id, data, type, changeData, names, settings }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="data-content">
      <span className="treenode-id">{id}</span>
      <Popover {...{ type, id, names, className: "view-content" }}>
        <InnerContent {...{ type, data, id }} />
      </Popover>
      <Button intent={Intent.PRIMARY} minimal onClick={() => setOpen(true)}>
        {names.edit}
      </Button>
      <Dialog
        state={{
          className: settings.theme,
          icon: IconNames.ANNOTATION,
          title: `${names.edit} ${names.content}`,
          isOpen,
          theme: settings.theme,
        }}
        hooks={{ setOpen }}
      >
        <Node
          node={data}
          idx={i}
          changeData={changeData}
          setOpen={setOpen}
          names={names}
        />
      </Dialog>
    </div>
  );
}

export function createTreeNode(props) {
  const { id, data, type, inTree, hooks } = props;

  const content = <TreeNodeContent {...{ ...props, ...hooks }} />;

  return {
    label: inTree ? (
      content
    ) : (
      <Box hooks={hooks} name={`${type}-${id}`} content={content} />
    ),
    id,
    hasCaret: false,
    childNodes: [],
    data,
    icon: IconNames.DOCUMENT,
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
    icon: aORb(state.type, IconNames.FOLDER_CLOSE, IconNames.DOCUMENT),
  };
}

function createDustbin(
  { type, id, data, label, additionalProps = {}, names },
  changeData
) {
  return (
    <Dustbin
      {...additionalProps}
      name={id}
      content={createContent({ type, id, data, label, changeData, names })}
    />
  );
}

function recurseNested(cur, data, depth = 1, changeData, names) {
  for (let i = 0; i < cur.length; i++) {
    const elem = cur[i];
    const node = data.find((el) => el.id === elem.id);
    const id = `${elem.type}-${node.id}`;
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
          names,
        }),
        id,
        hasCaret: true,
        isExpanded: true,
        data: node || {},
        childNodes: [],
        icon: aORb(elem.type, IconNames.FOLDER_CLOSE, IconNames.DOCUMENT),
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
            names,
          },
          changeData,
          childNodes: recurseNested(
            elem.childNodes,
            data,
            depth + 1,
            changeData,
            names
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
            names,
          }),
          id: elem.id,
          hasCaret: true,
          isExpanded: true,
          data: elem.data ? elem.data : {},
          childNodes: recurseNested(
            elem.childNodes,
            data,
            depth + 1,
            changeData,
            names
          ),
          icon: aORb(elem.type, IconNames.FOLDER_CLOSE, IconNames.DOCUMENT),
        };
      }
    }
    cur[i] = jsxObj;
  }
  return cur;
}

export function createTreeDustbins({
  state: { data, names, subject, structure },
  hooks: { changeData },
}) {
  // Max of 8 children
  const structureCopy = JSON.parse(JSON.stringify(structure));
  let nodes;
  if (structureCopy.childNodes.length < 8) {
    nodes = [
      createDustbinObj({
        state: {
          type: "subject",
          label: (
            <Editor
              contentEditable={false}
              readOnly={true}
              editorState={subject.content}
              setEditorState={() => null}
              theme="bubble"
            />
          ),
          id: `subject-${subject.id}`,
          nodeId: `subject-${subject.id}`,
          data: subject,
        },
        changeData,
        childNodes: [],
      }),
    ];
  } else {
    nodes = [
      {
        label: (
          <Editor
            contentEditable={false}
            readOnly={true}
            editorState={subject.content}
            setEditorState={() => null}
            theme="bubble"
          />
        ),
        id: subject.id,
        hasCaret: true,
        isExpanded: true,
        data: subject,
        childNodes: [],
        icon: IconNames.FOLDER_CLOSE,
      },
    ];
  }
  let result;
  if (structureCopy) {
    result = recurseNested(
      structureCopy.childNodes,
      data,
      1,
      changeData,
      names
    );
  }
  if (result) nodes[0].childNodes = result;

  return nodes;
}

export function createTreeBoxes({ state: { data, names, settings }, hooks }) {
  let id = 0;
  const treeNodes = [
    {
      label: names.content,
      id: id++,
      className: "folder",
      icon: IconNames.FOLDER_CLOSE,
      hasCaret: true,
      isExpanded: true,
      childNodes: [],
    },
  ];
  for (let i = 0; i < data.length; i++) {
    const nodesFolder = treeNodes[0];
    const node = data[i];
    nodesFolder.childNodes.push(
      createTreeNode({
        i,
        id: node.id,
        idx: id++,
        data: node,
        type: "node",
        inTree: node.inTree,
        names,
        settings,
        hooks,
      })
    );
  }
  return treeNodes;
}
