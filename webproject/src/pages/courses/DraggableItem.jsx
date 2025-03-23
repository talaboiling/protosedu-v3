import React from 'react';
import { useDrag } from 'react-dnd';
import classes from "./DraggableItem.module.css"
import { useDraggable, useDroppable } from '@dnd-kit/core';
const ItemTypes = {
  OPTION: 'option',
};

const DraggableItem = ({ option, idx }) => {
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: ItemTypes.OPTION,
  //   item: { value: option.value, id: option.id },
  //   begin: (monitor)=>{
  //     if (monitor?.dataTransfer){
  //       monitor.dataTransfer.setDragImage(new Image(), 0,0);
  //     } 
  //   },
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // }), [option.value]);

  const {attributes, listeners, setNodeRef, transform} = useDraggable({id: option.value});


  const style = transform ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
    } : undefined;

  return (
    <li 
      key={idx} 
      className={classes["studTaskOption"]}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{...style, zIndex: 12}}
    >
      {option.isImage ? (
        <img
          src={option.value}
          alt="option"
          style={{ width: '100px', height: '100px' }}
        />
      ) : (
        <p>{option.value}</p>
      )}
    </li>
  );
};

export default DraggableItem;
