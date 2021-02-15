import { getItem } from "../Utils/localStorage";

// Data defaults mainly used on page load
// [nodes]
const DEF_NODES_DATA = [];

const DEF_STRUCTURE_DATA = {
  id: "",
  nodeId: "",
  // subject
  type: "subject",
  content: null,
  childNodes: [
    // node with id and nodes
  ],
};

const DEF_SUBJECT_DATA = { content: null, id: "" };
const DEF_SUBJECTS_DATA = [];

const DEF_DATA_CHANGE = {
  update: "",
};

const DEF_DIMENSIONS = { width: null, height: null };

const DEF_NAMES = {
  subject: "Subject",
  create: "Create",
  edit: "Edit",
  view: "View",
  change: "Change",
  action: "Do it",
  content: "Content",
  delete: "Delete",
  settings: "Settings",
  theme: "Theme",
  names: "Names",
  remove: "Remove",
  createdAt: +new Date(),
};

const DEF_USER = {
  name: "",
  createdAt: +new Date(),
  picture: "",
  currentSubject: "",
  subjects: [],
  trees: [],
  nodes: [],
  step: 1,
  zIndex: 10,
};

const DEF_HELP = {
  id: 1,
  createdAt: +new Date(),
  content: {
    ops: [
      { attributes: { size: "large" }, insert: "An open canvas" },
      {
        insert:
          "\nPut whatever you want here\nHere's a tip:\nEmojis on mac? command + control + spacebar ",
      },
      { attributes: { size: "large" }, insert: "👐🏼" },
      { attributes: { list: "bullet" }, insert: "\n" },
    ],
  },
};

const DEF_SETTINGS = {
  theme: getItem("theme"),
  view: getItem("view"),
};

export default {
  data: DEF_NODES_DATA,
  structure: DEF_STRUCTURE_DATA,
  subject: DEF_SUBJECT_DATA,
  subjects: DEF_SUBJECTS_DATA,
  dataChange: DEF_DATA_CHANGE,
  dimensions: DEF_DIMENSIONS,
  names: DEF_NAMES,
  user: DEF_USER,
  help: DEF_HELP,
  settings: DEF_SETTINGS,
};
