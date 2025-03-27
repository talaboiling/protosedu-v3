import React from 'react'
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import bgtask from "../../assets/bgtask.svg";
import Loader from "../Loader";
import { useDraggable, useDroppable } from '@dnd-kit/core';
import bgvideo from "../../assets/videolessonthumb.svg";
const DraggableDroppableTask = ({contentIndex, content, xOffset, 
    itemWidth, containerWidth, yOffset, openLesson, 
    handleEditContent, handleTaskClick, handleEditTask, handleDeleteContent, move}
    ) => {
    const row = Math.floor(contentIndex / 2);
    const col = contentIndex % 2;
    const top = contentIndex * yOffset;

    const isEvenRow = row % 2 === 0;
    let style = {
      position: "absolute",
      top: top,
      width: itemWidth,
      height: itemWidth,
      backgroundColor: "#ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflowY: "hidden"
    };

    if (isEvenRow) {
      style.left = col * xOffset;
      console.log(style.left);
    } else {
      style.left =  containerWidth - itemWidth - col * xOffset;
    }

    //DND LOGIC

    const draggable = useDraggable({ id: contentIndex, data: {index: contentIndex, content} });
    const droppable = useDroppable({ id: contentIndex, data: {index: contentIndex, content} });

    const dndStyle = {
      transform: draggable.transform
        ? `translate3d(${draggable.transform.x}px, ${draggable.transform.y}px, 0)`
        : undefined,
      border: droppable.isOver ? '2px solid red' : '2px solid transparent',
      padding: '16px',
      margin: '8px',
      backgroundColor: '#ddd',
      cursor: move ? 'grab' : 'pointer',
    };
    const setCombinedRef = (node) => {
        draggable.setNodeRef(node);
        droppable.setNodeRef(node);
    };

    return <div
        ref={setCombinedRef}
        key={contentIndex}
        {...(move ? { ...draggable.listeners, ...draggable.attributes } : {})}
        className={`vidBlock ${content.content_type} ${
            content.template ? `template-${content.template}` : ""
        }`}
        style={{...style, ...dndStyle}}
    >
      {content.content_type === "lesson" && (
        <>
          <div
            className="thumbcontainer"
            style={{position: "relative"}}
            onClick={() => openLesson(contentIndex)}
            key={contentIndex}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditContent(contentIndex);
              }}
              className="deleteBtn editBtn"
            >
              <EditIcon sx={{ color: "black" }} />
            </button>
            <img
              src={bgvideo || "placeholder.png"}
              alt={content.title}
              className="taskThumbnail"
            />
          </div>
          <div
            className={`contentTitle ${
              content.title.length > 20 ? "title-slider" : ""
            }`}
          >
            <div className="title-slide">
              <p style={{ margin: "0" }}>{content.title}</p>
            </div>
          </div>
          <div className="taskHover" style={{position: "absolute", left: 0}}>
            <p>
              <strong>Название:</strong> {content.title}
            </p>
            <p>
              <strong>Описание:</strong> {content.description}
            </p>
          </div>
        </>
      )}
      {content.content_type === "task" && (
        <>
          <img
            src={bgtask}
            alt=""
            style={{
              paddingTop: "20px",
              scale: "1.3",
              overflow: "hidden",
            }}
            onClick={() => handleTaskClick(contentIndex)}
            key={contentIndex}
          />
          <div
            className={`contentTitle ${
              content.title.length > 15 ? "title-slider" : ""
            }`}
          >
            <div className="title-slide">
              <p style={{ margin: "0" }}>{content.title}</p>
            </div>
          </div>
          <div className="taskHover" style={{position: "absolute"}}>
            <p>
              <strong>Название:</strong> {content.title}
            </p>
            <p>
              <strong>Описание:</strong> {content.description}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTask(contentIndex);
            }}
            className="deleteBtn editBtn"
          >
            <EditIcon sx={{ color: "black" }} />
          </button>
        </>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteContent(content.id, content.content_type);
        }}
        className="deleteBtn"
      >
        <DeleteForeverIcon sx={{ color: "darkred" }} />
      </button>
    </div>
};

export default DraggableDroppableTask