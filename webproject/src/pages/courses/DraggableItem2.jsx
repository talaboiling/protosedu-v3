import React from 'react';
import { useDraggable } from '@dnd-kit/core'

function calculateBoundingRect(obj) {
    const left = obj.left || 0;
    const top = obj.top || 0;
    const width = (obj.width || 0) * (obj.scaleX || 1);
    const height = (obj.height || 0) * (obj.scaleY || 1);
  
    if (obj.angle) {
      const rad = (obj.angle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const bboxWidth = width * cos + height * sin;
      const bboxHeight = width * sin + height * cos;
      return {
        left: left - (bboxWidth - width) / 2,
        top: top - (bboxHeight - height) / 2,
        width: bboxWidth,
        height: bboxHeight,
      };
    }
    return { left, top, width, height };
  }

const DraggableItem2 = ({element, id}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  // Calculate the bounding rectangle from the Fabric.js object's properties.
    const bounds = calculateBoundingRect(element);

    // Base style for the element, based on its calculated bounds.
    const baseStyle = {
        position: 'absolute',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        backgroundColor: isDragging ? 'lightblue' : 'white',
        zIndex: 12,
        // Apply rotation if provided.
        transform: element.angle ? `rotate(${element.angle}deg)` : undefined,
        transformOrigin: element.angle ? 'center' : undefined,
    };

    const translation = transform ? `translate(${transform.x}px, ${transform.y}px)` : '';
    const rotation = element.angle ? `rotate(${element.angle}deg)` : '';
    const draggableTransform = `${translation} ${rotation}`.trim() || undefined;

    const mergedStyle = { ...baseStyle, transform: draggableTransform };

    if (element.type === 'image' && element.src) {
        return (
          <img
            id={id}
            ref={setNodeRef}
            src={element.src}
            alt=""
            style={{ ...mergedStyle, objectFit: 'cover' }}
            {...listeners}
            {...attributes}
            data-initial-left={bounds.left}
            data-initial-top={bounds.top}
          />
        );
      }
    
      return (
        <div 
            id={id} 
            ref={setNodeRef} 
            style={mergedStyle} 
            data-initial-left={bounds.left}
            data-initial-top={bounds.top}
            {...listeners} {...attributes} />
      );
}

export default DraggableItem2