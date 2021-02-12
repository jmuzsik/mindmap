import React from "react";
import update from "immutability-helper";

import db from "../../db";

import Editor from "../../Components/Editor";

export function handleStringCreation(label, data) {
  if (typeof label === "string") {
    return label;
  } else if (data.id) {
    return data.id;
  }
  return label;
}

export function aORb(type, a, b) {
  return type === "subject" ? a : b;
}

export function InnerContent({ data }) {
  return (
    <Editor
      contentEditable={false}
      readOnly={true}
      editorState={data.content}
      setEditorState={() => null}
      theme="bubble"
    />
  );
}

// https://stackoverflow.com/questions/22222599/javascript-recursive-search-in-json-object
export function findNode(id, currentNode, parent = {}, returnParent = false) {
  let i, currentChild, result;

  if (id === currentNode.nodeId) {
    if (returnParent) return parent;
    return currentNode;
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.childNodes.length; i++) {
      currentChild = currentNode.childNodes[i];
      // Search in the current child
      result = findNode(id, currentChild, currentNode, returnParent);

      // Return the result if the node has been found
      if (result !== false) {
        return result;
      }
    }

    // The node has not been found and we have no more options
    return false;
  }
}

export async function removeFromTree(nodeId, changeData, deletion) {
  // First get tree and update tree structure (remove node or nodes)
  const user = await db.user.toCollection().first();
  const tree = await db.trees.get({ subjectId: user.currentSubject });
  const { structure } = tree;

  // Set the property inTree to false for each piece of data
  const data = [];

  // Remove from structure
  // Either nested one down the heirarchy

  let childNodes;

  for (let i = 0; i < structure.childNodes.length; i++) {
    const elem = structure.childNodes[i];
    let inner;
    if (elem.nodeId === nodeId) {
      // Go through and update each data within if there are elements
      for (let j = 0; j < elem.childNodes.length; j++) {
        inner = elem.childNodes[j];
        await db.nodes.update(inner.id, { inTree: false });
        data.push(await db.nodes.get(inner.id));
      }
      // removal
      childNodes = update(structure.childNodes, (arr) =>
        arr.filter((n) => n.nodeId !== nodeId)
      );
      await db.nodes.update(elem.id, { inTree: false });
      data.push(await db.nodes.get(elem.id));
      break;
    }
    // Otherwise check if inner node is what has the id
    if (elem.childNodes.length > 0) {
      // or two down the heirarchy
      for (let j = 0; j < elem.childNodes.length; j++) {
        inner = elem.childNodes[j];
        if (inner.nodeId === nodeId) {
          childNodes = update(structure.childNodes, {
            [i]: {
              childNodes: (arr) => arr.filter((n) => n.nodeId !== nodeId),
            },
          });
          await db.nodes.update(inner.id, { inTree: false });
          data.push(await db.nodes.get(inner.id));
          break;
        }
      }
    }
  }
  const updatedStructure = update(structure, {
    childNodes: { $set: childNodes },
  });
  // If what is deleted is not within the tree structure
  // - this is called whenever a node is deleted
  if (data.length === 0) return null;

  await db.trees.update(tree.id, { structure: updatedStructure });
  if (deletion) {
    return { data, updatedStructure };
  } else {
    changeData({ update: "updateTree", data, structure: updatedStructure });
  }
}

export function getDim(ref, isOpen) {
  if (ref.current) {
    const [width, height] = [ref.current.clientWidth, ref.current.clientHeight];
    if (isOpen) {
      return {
        width: width - width / 4,
        height,
      };
    } else {
      return { width, height };
    }
  }
}
