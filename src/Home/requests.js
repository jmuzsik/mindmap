import update from "immutability-helper";

import db from "../db";

// May want to use again in future
// export function organiseSubjects({ subjects, currentSubject }) {
//   const firstSubject = subjects.filter(({ id }) => currentSubject === id);
//   const otherSubjects = subjects.filter(({ id }) => currentSubject !== id);
//   const organisedSubjects = firstSubject.concat(otherSubjects);
//   return organisedSubjects;
// }

// https://stackoverflow.com/questions/22222599/javascript-recursive-search-in-json-object
export function findNode(id, currentNode, parent = {}, returnParent = false) {
  let i, currentChild, result;

  if (id === currentNode.id) {
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
        await db[inner.type + "s"].update(inner.id, { inTree: false });
        data.push([await db[inner.type + "s"].get(inner.id), inner.type]);
      }
      // removal
      childNodes = update(structure.childNodes, (arr) =>
        arr.filter((n) => n.nodeId !== nodeId)
      );
      await db[elem.type + "s"].update(elem.id, { inTree: false });
      data.push([await db[elem.type + "s"].get(elem.id), elem.type]);
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
          await db[inner.type + "s"].update(inner.id, { inTree: false });
          data.push([await db[inner.type + "s"].get(inner.id), inner.type]);
          break;
        }
      }
    }
  }
  const updatedStructure = update(structure, {
    childNodes: { $set: childNodes },
  });
  // If what is deleted is not within the tree structure
  // - this is called whenever an image or note is deleted
  if (data.length === 0) return null;

  await db.trees.update(tree.id, { structure: updatedStructure });
  if (deletion) {
    return { data, updatedStructure };
  } else {
    changeData({ update: "updateTree", data, structure: updatedStructure });
  }
}
