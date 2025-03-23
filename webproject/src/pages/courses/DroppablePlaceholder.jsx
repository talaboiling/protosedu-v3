import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useDrop } from 'react-dnd';
import Outside from './Outside';

export function calculateBoundingRect(obj) {
  // Use default values if properties are missing
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);

  // If there is a rotation angle, compute the axis-aligned bounding box
  if (obj.angle) {
    const rad = obj.angle * Math.PI / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const bboxWidth = width * cos + height * sin;
    const bboxHeight = width * sin + height * cos;
    // Adjust left and top to center the rotated bounding box over the original object
    return {
      left: left - (bboxWidth - width) / 2,
      top: top - (bboxHeight - height) / 2,
      width: bboxWidth,
      height: bboxHeight
    };
  }
  return { left, top, width, height };
}



const DroppablePlaceholder = ({ id, element, answer, showAnswer}) => {
  // const [{ isOver, canDrop }, drop] = useDrop(() => ({
  //   accept: ItemTypes.OPTION,
  //   drop: (item) => {
  //     onDrop(index, item);
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }));
  console.log(element);
  const {setNodeRef, isOver} = useDroppable({
    id
  });

  const bounds = calculateBoundingRect(element);
  console.log(bounds);

  // Define common styles using the calculated bounds.
  const commonStyle = {
    position: 'absolute',
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    border: '2px dashed gray',
    backgroundColor: (isOver || answer) ? 'lightgreen' : 'white',
    zIndex: 10,
    transform: element.angle ? `rotate(${element.angle}deg)` : undefined,
    transformOrigin: element.angle ? 'center' : undefined,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  if (element.type === 'image' && element && element.src) {
    return (
      <img
        id={id}
        ref={setNodeRef}
        src={element.src}
        alt=""
        style={{ ...commonStyle, objectFit: 'cover' }}
      />
    );
  } else {
    console.log(answer);
    return (
      <div id={id} ref={setNodeRef} style={commonStyle}>
        {answer && showAnswer && <p>{answer.answer}</p>}
      </div>
    );
  }
};

export default DroppablePlaceholder;
