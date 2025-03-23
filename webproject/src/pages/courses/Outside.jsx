import React from 'react';
import { calculateBoundingRect } from './DroppablePlaceholder';

function renderOutsideElement(obj, styles, children) {
  const overlay = document.getElementById("upper-content");
  if (!overlay) {
    console.error('Container with id "overlay-content" not found.');
    return;
  }

  console.log(obj);

  let htmlElem;
    if (obj.type === "image" && obj && obj.src) {
      htmlElem = document.createElement("img");
      htmlElem.src = obj.src;
      htmlElem.style.objectFit = "cover";
    } else {
      htmlElem = document.createElement("div");
      // Example styling for non-image objects.
    }


    // Get the Fabric object's bounding rectangle.
    const bounds = calculateBoundingRect(obj);
    
    // Position and size the HTML element to match the Fabric object.
    htmlElem.style.position = "absolute";
    htmlElem.style.left = bounds.left + "px";
    htmlElem.style.top = bounds.top + "px";
    htmlElem.style.width = bounds.width + "px";
    htmlElem.style.height = bounds.height + "px";
    Object.entries(styles).forEach(([prop, value]) => {
      htmlElem.style[prop] = value;
    });

    // Apply rotation if the object is rotated.
    if (obj.angle) {
      htmlElem.style.transform = `rotate(${obj.angle}deg)`;
      htmlElem.style.transformOrigin = "center";
    }
    
    // Enable pointer events for drag-and-drop functionality.
    htmlElem.style.pointerEvents = "auto";
    // Optionally, add a class for additional styling or event handling.
    htmlElem.classList.add("canvas-clone");
    htmlElem.id = obj.id;
    if (children) htmlElem.innerHTML = children;
    // Append the HTML element to the overlay container.
    overlay.appendChild(htmlElem);

}


const Outside = ({children, element, handleClick, handleUserInput, onBlur}) => {
    console.log(element);

    const bounds = calculateBoundingRect(element);

    const commonStyle = {
      position: 'absolute',
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      zIndex: 10,
      transform: element.angle ? `rotate(${element.angle}deg)` : undefined,
      transformOrigin: element.angle ? 'center' : undefined,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer"
    };

    const commonStyleInput = {
      position: 'absolute',
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      zIndex: 10,
      padding: "0.5rem",
      borderBox: "fit-content",
      fontSize: "18px",
      fontWeight: "700"
    };
    
    if (element.type === 'image' && element && element.src) {
      return (
        <img
          id={element.id}
          src={element.src}
          alt=""
          style={{ ...commonStyle, objectFit: 'cover' }}
          onClick={()=>handleClick(element.id)}
        />
      );
    }else if (element.metadata && element.metadata.isInput) {
      return (
        <input
          id={element.id}
          style={{ ...commonStyleInput, boxSizing: "border-box"}}
          onChange={(e)=>handleUserInput(element.id, e.target.value)}
          onBlur={onBlur}
        />
      );
    } else {
      return (
        <div id={element.id} style={commonStyle} onClick={()=>handleClick(element.id)}>
        </div>
      );
    }
}

export default Outside