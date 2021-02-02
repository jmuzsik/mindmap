import update from "immutability-helper";

import db from "./db";

import {
  DEF_DIMENSIONS,
  DEF_NAMES,
  DEF_STRUCTURE_DATA,
  DEF_SUBJECT_DATA,
} from "./defaults";

export default async (treeData) => {
  const user = await db.user.toCollection().first();
  if (!user) return treeData;
  const names = (await db.names.toCollection().first()) || DEF_NAMES;
  const subjectId = user.currentSubject;
  const subject =
    (await db.subjects.get({ id: subjectId })) || DEF_SUBJECT_DATA;
  const subjects = (await db.subjects.toArray()) || [];
  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const structure = tree?.structure || DEF_STRUCTURE_DATA;

  return update(treeData, {
    data: { $set: nodes },
    subject: { $set: subject },
    subjects: { $set: subjects },
    structure: { $set: structure },
    dimensions: { $set: DEF_DIMENSIONS },
    names: { $set: names },
  });
};
