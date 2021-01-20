export function handleDataChange(
  {
    treeData: { structure, data, subject, subjects, dimensions },
    dataChange: { parentId, dataId },
  },
  { setTreeData, changeData }
) {
  // image or note?
  const noteOrImage =
    data[0].childNodes.filter((n) => n.id === dataId).length === 1 ? 0 : 1;
  // Get node from tree map
  const node = data[noteOrImage].childNodes.filter((n) => n.id === dataId)[0];
  // Remove node from tree map
  // TODO: turn this into something undraggable but have view/edit functionality
  // ie. get rid of box jsx but keep other jsx
  // { i, id, data, type, hooks }
  const noteOrImageStr = noteOrImage === 0 ? "note" : "image";
  // node.label = (
  //   <Content
  //     {...{
  //       id: node.id,
  //       data: node.data,
  //       hooks: { changeData },
  //       type: noteOrImageStr,
  //     }}
  //   />
  // );
  // Get insertion point
  // [0] as that is the top level node (it is array solely for the blueprint library)
  // TODO: no good reason to be array
  // const [mindMapTreeNode, depth] = findNode(parentId, structure.nodes[0]);

  // Update node for mind tree (ie. box becomes dustbin) (max depth of 2)
  let treeObj;
  // Right now I only support a depth of 2: 0 -> 1 -> 1.1
  // if (depth === 2) {
  //   treeObj = {
  //     id: node.id,
  //     hasCaret: false,
  //     isExpanded: false,
  //     data: node.data,
  //     childNodes: [],
  //     icon:
  //       noteOrImageStr === "note"
  //         ? IconNames.DOCUMENT
  //         : noteOrImageStr === "image"
  //         ? IconNames.MEDIA
  //         : IconNames.FOLDER_CLOSE,
  //     label: createContent({
  //       type: noteOrImageStr,
  //       id: node.id,
  //       data: node.data,
  //       label: node.id,
  //     }),
  //   };
  // } else {
  //   treeObj = createDustbinObj({
  //     type: noteOrImageStr,
  //     id: node.id,
  //     label: node.id,
  //     data: node.data,
  //     additionalProps: {
  //       hasCaret: true,
  //       isExpanded: true,
  //       icon: "folder-close",
  //     },
  //   }
  // );
  // }
  // push updated
  // mindMapTreeNode.childNodes.push(treeObj);

  // const mindMapStructure = createMindMapStructure(structure, subject);
  // setTreeData({
  //   subject,
  //   subjects,
  //   data,
  //   structure,
  //   dimensions,
  //   mindMapStructure,
  // });

  changeData({ parentId: null, dataId: null, updateTree: true });
}
