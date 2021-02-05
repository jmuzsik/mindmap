import update from "immutability-helper";

export default (dataChange, treeData) => {
  let data, idx;

  switch (dataChange.update) {
    case "newData":
      return update(treeData, {
        data: { $push: [dataChange.item] },
      });
    case "delete":
      return update(treeData, {
        data: (arr) => arr.filter((item) => item.id !== dataChange.id),
      });
    case "edit":
      idx = treeData.data.findIndex(({ id }) => id === dataChange.node.id);
      return update(treeData, {
        data: { [idx]: { $set: dataChange.node } },
      });
    case "newSubject":
      return update(treeData, {
        subjects: {
          $push: [dataChange.subject],
        },
        subject: { $set: dataChange.subject },
        data: { $set: dataChange.data },
        structure: { $set: dataChange.structure },
      });
    case "updateSubject":
      return update(treeData, {
        subject: { $set: dataChange.subject },
        structure: { $set: dataChange.structure },
        data: { $set: dataChange.data },
      });
    case "deleteSubject":
      return update(treeData, {
        subject: { $set: dataChange.subject },
        subjects: { $set: dataChange.subjects },
        structure: { $set: dataChange.structure },
        data: { $set: dataChange.data },
      });
    case "updateTreeSingular":
      idx = treeData.data.findIndex(({ id }) => id === dataChange.item.id);
      return update(treeData, {
        data: {
          [idx]: {
            inTree: {
              $set: dataChange.item.inTree,
            },
          },
        },
        structure: {
          $set: dataChange.structure,
        },
      });
    case "updateTree":
      for (let i = 0; i < dataChange.data.length; i++) {
        const d = dataChange.data[i];
        const idx = treeData.data.findIndex(({ id }) => id === d.id);
        // I do this as I need to update treedata.data multiple times occasionally
        data = update(data ? data : treeData.data, {
          [idx]: {
            inTree: {
              $set: d.inTree,
            },
          },
        });
      }
      return update(treeData, {
        data: { $set: data },
        structure: { $set: dataChange.structure },
      });
    case "deleteAndRemove":
      for (let i = 0; i < dataChange.data.length; i++) {
        const d = dataChange.data[i];
        const idx = treeData.data.findIndex(({ id }) => id === d.id);
        data = update(data ? data : treeData.data, {
          [idx]: {
            inTree: {
              $set: d.inTree,
            },
          },
        });
      }
      data = update(data ? data : treeData.data, (arr) =>
        arr.filter((item) => item.id !== dataChange.id)
      );
      return update(treeData, {
        data: { $set: data },
        structure: { $set: dataChange.structure },
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
