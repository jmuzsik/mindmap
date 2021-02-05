import update from "immutability-helper";

import db from "../db";

import defaults from "./defaults";

export default async (treeData) => {
  const user = await db.user.toCollection().first();
  if (!user) return treeData;
  const names = (await db.names.toCollection().first()) || defaults.names;
  const subjectId = user.currentSubject;
  const subject =
    (await db.subjects.get({ id: subjectId })) || defaults.subject;
  const subjects = (await db.subjects.toArray()) || [];
  const nodes = (await db.nodes.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const help = await db.help.toCollection().first();
  const structure = tree?.structure || defaults.structure;

  return update(treeData, {
    data: { $set: nodes },
    subject: { $set: subject },
    subjects: { $set: subjects },
    structure: { $set: structure },
    dimensions: { $set: defaults.dimensions },
    names: { $set: names },
    help: { $set: help },
  });
};
