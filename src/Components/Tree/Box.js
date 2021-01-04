import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

export const Box = ({ name, content }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name, type: ItemTypes.BOX },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} className="box" style={{ opacity }}>
      {content}
    </div>
  );
};
