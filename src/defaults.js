// [nodes]
export const DEF_NODES_DATA = [];

export const DEF_STRUCTURE_DATA = {
  id: "",
  // subject
  type: "subject",
  content: null,
  childNodes: [
    // node with id and nodes
  ],
};

export const DEF_SUBJECT_DATA = { content: null, id: "" };
export const DEF_SUBJECTS_DATA = [];

export const DEF_DATA_CHANGE = {
  update: "",
};

export const DEF_DIMENSIONS = { width: null, height: null };

export const DEF_NAMES = {
  subject: "Subject",
  create: "Create",
  edit: "Edit",
  view: "View",
  change: "Change",
  action: "Do it",
  content: "Content",
  delete: "Delete",
  createdAt: +new Date(),
};

export const DEF_USER = {
  name: "",
  createdAt: +new Date(),
  picture: "",
  theme: "light",
  view: "dnd",
  editor: "snow",
  currentSubject: "",
  subjects: [],
  trees: [],
  nodes: [],
};

export const DEF_HELP = {
  id: 1,
  createdAt: +new Date(),
  content: {
    ops: [
      { insert: "Emojis on mac? command + control + enter " },
      { attributes: { size: "huge" }, insert: "👐🏼" },
      { insert: "\n" },
    ],
  },
};
