import update from "immutability-helper";

export default (dataChange, treeData) => {
  // This is simple and not exact as i need data to change as
  // within DnD i make api calls in an async way but do not await
  // the results for performance reasons
  // Hence, updating all data allows any updates which occurred
  // to be known when the jsx is created
  // This is not the ideal way, but it is still very fast
  switch (dataChange.update) {
    case "setData":
      return update(treeData, {
        data: { $set: dataChange.data },
      });
    case "updateSubjects":
      return update(treeData, {
        subjects: { $set: dataChange.subjects },
        subject: { $set: dataChange.subject },
        data: { $set: dataChange.data },
        structure: { $set: dataChange.structure },
      });
    case "updateTreeAndData":
      return update(treeData, {
        data: { $set: dataChange.data },
        structure: {
          $set: dataChange.structure,
        },
      });
    case "updateNames":
      return update(treeData, {
        names: {
          $set: dataChange.names,
        },
      });
    default:
      // This is used to check if first render as this will get called
      return null;
  }
};
