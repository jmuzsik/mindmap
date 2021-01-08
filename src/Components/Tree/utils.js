import React from "react";
import {
  Button,
  Intent,
  Popover,
  PopoverInteractionKind,
} from "@blueprintjs/core";
import { convertFromRaw, EditorState } from "draft-js";

import RichEditor from "../Editor/Editor";
import { Dustbin } from "./Dustbin";

// const createLabel = ({type, id, label, i}) => {
//   return (
//     <Dustbin
//       content={
//         <React.Fragment>
//           <span className="treenode-id">{id || label}</span>
//           {type ? (
//             <Popover
//               popoverClassName={`note-${i}-popover`}
//               portalClassName={`note-${i}-portal`}
//               interactionKind={PopoverInteractionKind.HOVER}
//               intent={Intent.WARNING}
//               minimal
//             >
//               <Button intent={Intent.PRIMARY} minimal>
//                 View
//               </Button>
//               {type &&
//                 (type === "note" ? (
//                   <RichEditor
//                     id={id}
//                     minimal
//                     controls={false}
//                     editorState={EditorState.createWithContent(
//                       convertFromRaw(JSON.parse(data.raw))
//                     )}
//                     contentEditable={false}
//                     readOnly={true}
//                     onChange={() => null}
//                   />
//                 ) : (
//                   <img
//                     src={data.src}
//                     alt={id}
//                     width={data.width}
//                     height={data.height}
//                   />
//                 ))}
//             </Popover>
//           ) : null}
//         </React.Fragment>
//       }
//     />
//   );
// };

export function updateTrees(
  { mindMapTreeData, treeMap, mindMapTreeId, treeMapId, subject },
  { setTreeData }
) {
  setTreeData({
    subject,
    data: treeMap,
    structure: mindMapTreeData,
    dataChange: { structureId: mindMapTreeId, dataId: treeMapId },
  });
  // setTreeData(mindMapTreeData);
}
