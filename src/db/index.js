import Dexie from "dexie";
import {
  userModel,
  treeModel,
  subjectModel,
  nodeModel,
  namesModel,
} from "./models";

// Literally deletes entire db
// Dexie.delete("mindmap");
const db = new Dexie("mindmap");
// Everytime a model changes, the version also needs to change
db.version(7).stores({
  user: userModel,
  trees: treeModel,
  subjects: subjectModel,
  nodes: nodeModel,
  names: namesModel,
});

export default db;
