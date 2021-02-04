import Dexie from "dexie";
import {
  userModel,
  treeModel,
  subjectModel,
  nodeModel,
  namesModel,
  helpModel,
} from "./models";

// deletes entire db
// Dexie.delete("mindmap");
const db = new Dexie("mindmap");
// Everytime a model changes, the version also needs to change
db.version(25).stores({
  user: userModel,
  trees: treeModel,
  subjects: subjectModel,
  nodes: nodeModel,
  names: namesModel,
  help: helpModel,
});

export default db;
