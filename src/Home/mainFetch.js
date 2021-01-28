import update from "immutability-helper";

import db from "../db";

import { DEF_STRUCTURE_DATA, DEF_SUBJECT_DATA } from "./defaults";

import { getDim } from "./utils";

export default async (treeData, { svgRef, isOpen }) => {
  const user = await db.user.toCollection().first();
  const subjectId = user.currentSubject;
  const subject =
    (await db.subjects.get({ id: subjectId })) || DEF_SUBJECT_DATA;
  const subjects = (await db.subjects.toArray()) || [];
  const notes = (await db.notes.where({ subjectId }).toArray()) || [];
  const images = (await db.images.where({ subjectId }).toArray()) || [];
  const tree = await db.trees.get({ subjectId });
  const structure = tree?.structure || DEF_STRUCTURE_DATA;

  return update(treeData, {
    data: { $set: [notes, images] },
    subject: { $set: subject },
    subjects: { $set: subjects },
    structure: { $set: structure },
    dimensions: { $set: getDim(svgRef, isOpen) },
  });
};
