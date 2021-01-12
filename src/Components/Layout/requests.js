import AuthClass from "../../TopLevel/Auth/Class";
import createGetOptions from "../../Utils/FetchOptions/Get";
import { updateTreeMap, createTreeNode } from "./utils";

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
    const idx = images[i].imgId;
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
      id: idx,
      width: currentImg.width,
      height: currentImg.height,
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
    return [
      {
        label: "",
        id: 0,
        className: "folder",
        icon: "folder-close",
        hasCaret: true,
        childNodes: [],
      },
    ];
  }
  if (!tree.error) {
    return JSON.parse(tree.json);
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
  const node = createTreeNode({
    i: Math.random() * 10,
    id: data._id || data.id,
    idx: data._id || data.id,
    data: data,
    type: t,
    hooks,
  });
  let notesMap = treeData.data[0],
    imagesMap = treeData.data[1];
  if (type === "notes") {
    notesMap.childNodes.push(node);
  } else {
    imagesMap.childNodes.push(node);
  }
  console.log({
    ...treeData,
    data: [notesMap, imagesMap],
  })
  hooks.setTreeData({
    ...treeData,
    data: [notesMap, imagesMap],
  });
}
