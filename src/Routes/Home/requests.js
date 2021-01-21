import AuthClass from "../../TopLevel/Auth/Class";
import createGetOptions from "../../Utils/FetchOptions/Get";
import createPostOptions from "../../Utils/FetchOptions/Post";

export async function getNotes() {
  const id = AuthClass.getUser()._id;
  const url = `/api/note/user/${id}`;
  const options = createGetOptions();
  let notes = await fetch(url, options);
  // TODO: handle error
  notes = await notes.json();
  if (!notes.error) {
    return notes;
  }
}

export async function getImages() {
  const id = AuthClass.getUser()._id;
  console.log(AuthClass.getUser())
  let url = `/api/image/${id}`;
  let options = createGetOptions();
  let images;
  try {
    images = await fetch(url, options);
  } catch (error) {
    // TODO: handle this
  }
  images = await images.json();
  const finalArray = [];
  options = createGetOptions(null, "blob");
  for (let i = 0; i < images.length; i++) {
    const currentImg = images[i];
    const idx = currentImg.imgId;
    url = `/api/image/user/${idx}`;
    let image;
    try {
      image = await fetch(url, options);
    } catch (error) {
      // TODO: handle errorrrrrr
    }
    image = await image.blob();
    image = URL.createObjectURL(image);

    finalArray.push({
      src: image,
      ...currentImg,
    });
  }
  return finalArray;
}

export async function getMindMapTreeData() {
  const user = AuthClass.getUser();
  const id = user._id;
  const currentSubject = user.currentSubject;
  const url = `/api/tree/${id}/${currentSubject}`;
  const options = createGetOptions();
  let tree = await fetch(url, options);
  // TODO: handle error
  try {
    tree = await tree.json();
  } catch (error) {
    console.log("within fetching tree by id, there is no tree!", error);
    return {
      childNodes: [
        {
          id: "0",
          radius: 12,
          depth: 0,
          jsx: null,
        },
      ],
      links: [],
    };
  }
  if (!tree.error) {
    return tree;
  }
}

export async function getSubject(subjectId) {
  const url = `/api/subject/${subjectId}`;
  const getOptions = createGetOptions();
  let subject;
  try {
    subject = await fetch(url, getOptions);
  } catch (error) {
    console.log("within fetching subject by id", error);
  }
  try {
    subject = await subject.json();
  } catch (error) {
    console.log("within fetching subject by id, there is no subject!", error);
    return { name: "", _id: null };
  }
  return subject;
}

export function organiseSubjects({ subjects, currentSubject }) {
  const firstSubject = subjects.filter(({ _id }) => currentSubject === _id);
  const otherSubjects = subjects.filter(({ _id }) => currentSubject !== _id);
  const organisedSubjects = firstSubject.concat(otherSubjects);
  return organisedSubjects;
}

export async function getSubjects(currentSubject, userId) {
  const url = `/api/subject/user/${userId}`;
  const getOptions = createGetOptions();
  let subjects;
  try {
    subjects = await fetch(url, getOptions);
    subjects = await subjects.json();
  } catch (error) {
    console.log("within fetching subjects", error);
  }
  const organisedSubjects = organiseSubjects({
    subjects,
    currentSubject,
  });
  return organisedSubjects;
}

export async function updateFolder(treeData, hooks, type) {
  const t = type === "notes" ? "note" : "image";
  let req;
  let data;
  if (type === "notes") {
    req = await getNotes();
    data = req[req.length - 1];
  } else {
    req = await getImages();
    data = req[req.length - 1];
  }
  // const node = createTreeNode({
  //   i: Math.random() * 10,
  //   id: data._id || data.id,
  //   idx: data._id || data.id,
  //   data: data,
  //   type: t,
  //   hooks,
  // });
  let notesMap = treeData.data[0],
    imagesMap = treeData.data[1];
  // if (type === "notes") {
  //   notesMap.childNodes.push(node);
  // } else {
  //   imagesMap.childNodes.push(node);
  // }
  hooks.setTreeData({
    ...treeData,
    data: [notesMap, imagesMap],
  });
}

export async function getNote(id) {
  const url = `/api/note/${id}`;
  const options = createGetOptions();
  let note;
  try {
    note = await fetch(url, options);
    note = await note.json();
  } catch (error) {
    console.log("error in trying to get a note by id", error);
  }
  return note;
}
export async function getImage(id) {
  const url = `/api/image/${id}`;
  const options = createGetOptions();
  let image;
  try {
    image = await fetch(url, options);
    image = await image.json();
  } catch (error) {
    console.log("error in trying to get a image by id", error);
  }
  return image;
}

async function updateData(type, id, inTree) {
  const obj = { inTree };
  const url = `/api/${type}/tree/${id}`;
  const options = createPostOptions(obj, "PUT");
  let data;
  try {
    data = await fetch(url, options);
    data = await data.json();
  } catch (error) {
    console.log(`error in trying to get a ${type} by id`, error);
  }
  return data;
}

// https://stackoverflow.com/questions/22222599/javascript-recursive-search-in-json-object
export function findNode(
  id,
  currentNode,
  parent = {},
  returnParent = false,
  path = ""
) {
  let i, currentChild, result;

  // TODO: fix this annoying id _id thing
  if (id === currentNode.id || id === currentNode._id) {
    if (returnParent) return [parent, path];
    return [currentNode, path];
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    if (currentNode.type !== "subject") path += "childNodes.";
    for (i = 0; i < currentNode.childNodes.length; i++) {
      path += String(i) + ".";
      currentChild = currentNode.childNodes[i];
      // Search in the current child
      result = findNode(id, currentChild, currentNode, returnParent, path);

      // Return the result if the node has been found
      if (result !== false) {
        return result;
      }
    }

    // The node has not been found and we have no more options
    return false;
  }
}

export async function updateTree(tree, id) {
  const url = `/api/tree/${id}`;
  const options = createPostOptions(tree, "PUT");
  let data;
  try {
    data = await fetch(url, options);
    data = await data.json();
  } catch (error) {
    console.log(`error in trying to get a tree by id and update it`, error);
  }
  return JSON.parse(data.structure);
}

export async function updateInTree(id, type, inTree) {
  let data;
  // This is called with and without type known
  if (type) {
    return [await updateData(type, id, inTree), type];
  }
  data = await updateData("note", id, inTree);
  if (data.error) {
    type = "image";
    data = await updateData("image", id, inTree);
  } else type = "note";
  return [data, type];
}

export async function removeFromTree(id, changeData, deletion) {
  // First get tree and update tree structure (remove node or nodes)
  const tree = await getMindMapTreeData();
  const structure = JSON.parse(tree.structure)[0];

  // Set the property inTree to false for each piece of data
  const data = [];

  // Remove from structure
  // Either nested one down the heirarchy

  for (let i = 0; i < structure.childNodes.length; i++) {
    const elem = structure.childNodes[i];
    let inner;
    if (elem._id === id) {
      // Go through and update each data within if there are elements
      for (let j = 0; j < elem.childNodes.length; j++) {
        inner = elem.childNodes[j];
        data.push(await updateInTree(inner._id, inner.type, false));
      }
      // removal
      structure.childNodes = structure.childNodes.filter((n) => n._id !== id);
      data.push(await updateInTree(elem._id, elem.type, false));
      break;
    }
    // Otherwise check if inner node is what has the id
    if (elem.childNodes.length > 0) {
      // or two down the heirarchy
      for (let j = 0; j < elem.childNodes.length; j++) {
        inner = elem.childNodes[j];
        if (inner._id === id) {
          structure.childNodes[i].childNodes = structure.childNodes[
            i
          ].childNodes.filter((n) => n._id !== id);
          data.push(await updateInTree(inner._id, inner.type, false));
          break;
        }
      }
    }
  }

  // If what is deleted is not within the tree structure
  if (data.length === 0) return null;

  // should be an array... this is off to do
  const updatedStructure = await updateTree([structure], tree._id);
  if (deletion) {
    return { data, updatedStructure };
  } else {
    changeData({ update: "updateTree", data, structure: updatedStructure });
  }
}
