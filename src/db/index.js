import Dexie from "dexie";
import {
  noteModel,
  imageModel,
  userModel,
  treeModel,
  subjectModel,
} from "./models";

// Dexie.delete("mindmap");
const db = new Dexie("mindmap");
db.version(3).stores({
  user: userModel,
  notes: noteModel,
  trees: treeModel,
  images: imageModel,
  subjects: subjectModel,
});

export default db;
