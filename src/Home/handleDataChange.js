import update from "immutability-helper";

export default (dataChange, treeData) => {
  let data, noteOrImage, idx;

  switch (dataChange.update) {
    case "newData":
      noteOrImage = dataChange.notes === true ? 0 : 1;
      return update(treeData, {
        data: { [noteOrImage]: { $push: [dataChange.item] } },
      });
    case "delete":
      noteOrImage = dataChange.type === "note" ? 0 : 1;
      return update(treeData, {
        data: {
          [noteOrImage]: (arr) =>
            arr.filter((item) => item.id !== dataChange.id),
        },
      });
    case "edit":
      idx = treeData.data[0].findIndex(({ id }) => id === dataChange.note.id);
      return update(treeData, {
        data: { 0: { [idx]: { $set: dataChange.note } } },
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
        subject: { $set: dataChange.currentSubject },
        data: { $set: dataChange.data },
        structure: { $set: dataChange.structure },
      });
    case "updateTreeSingular":
      noteOrImage = dataChange.type === "note" ? 0 : 1;
      idx = treeData.data[noteOrImage].findIndex(
        ({ id }) => id === dataChange.item.id
      );
      return update(treeData, {
        data: {
          [noteOrImage]: {
            [idx]: {
              inTree: {
                $set: dataChange.item.inTree,
              },
            },
          },
        },
        structure: {
          $set: dataChange.structure,
        },
      });
    case "updateTree":
      for (let i = 0; i < dataChange.data.length; i++) {
        const [d, t] = dataChange.data[i];
        noteOrImage = t === "note" ? 0 : 1;
        const idx = treeData.data[noteOrImage].findIndex(
          ({ id }) => id === d.id
        );
        // I do this as I need to update treedata.Data multiple times occasionally
        data = update(data ? data : treeData.data, {
          [noteOrImage]: {
            [idx]: {
              inTree: {
                $set: d.inTree,
              },
            },
          },
        });
      }
      return update(treeData, {
        data: { $set: data },
        structure: { $set: dataChange.structure },
      });
    case "deleteAndRemove":
      const c = (t) => (t === "note" ? 0 : 1);
      for (let i = 0; i < dataChange.data.length; i++) {
        const [d, t] = dataChange.data[i];
        noteOrImage = c(t);
        const idx = treeData.data[noteOrImage].findIndex(
          ({ id }) => id === d.id
        );
        data = update(data ? data : treeData.data, {
          [noteOrImage]: {
            [idx]: {
              inTree: {
                $set: d.inTree,
              },
            },
          },
        });
      }
      data = update(data ? data : treeData.data, {
        [c(dataChange.type)]: (arr) =>
          arr.filter((item) => item.id !== dataChange.id),
      });
      return update(treeData, {
        data: { $set: data },
        structure: { $set: dataChange.structure },
      });
    default:
      // This is used to check if first render as this will get called
      return null;
  }
};
