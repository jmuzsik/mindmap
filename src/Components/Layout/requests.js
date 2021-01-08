import AuthClass from "../../TopLevel/Auth/Class";
import createGetOptions from "../../Utils/FetchOptions/Get";
import {
  createTreeMap,
  tempImages,
  tempNotes,
  createSmap,
  createMindMapTreeData,
  createSimplifiedTreeMap,
  createCallout,
} from "./utils";

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

export async function getSubject(subjectId, setSubject) {
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
  setSubject(subject);
}
