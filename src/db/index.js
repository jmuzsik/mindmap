import Dexie from "dexie";
import {
  noteModel,
  imageModel,
  userModel,
  treeModel,
  subjectModel,
} from "./models";

// Literally deletes entire db
// Dexie.delete("mindmap");
const db = new Dexie("mindmap");
// Everytime a model changes, the version also needs to change
db.version(4).stores({
  user: userModel,
  notes: noteModel,
  trees: treeModel,
  images: imageModel,
  subjects: subjectModel,
});

export default db;
