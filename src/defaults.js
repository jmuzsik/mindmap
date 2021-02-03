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
  view: "View",
  edit: "Edit",
  change: "Change",
  fresh: "New",
  network: "Network",
  dnd: "DnD",
  settings: "Settings",
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
  currentSubject: "",
  subjects: [],
  trees: [],
  nodes: [],
};
