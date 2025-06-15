import React from 'react'
import bgtask from "../../assets/bgtask.svg";
import { EditIcon } from 'lucide-react';
import { CirclePlus } from 'lucide-react';

const TaskNode = ({node, content, handleEditTask, handleTaskClick, handleAddTaskButton}) => {

    let style = {
        position: "relative",
        width: "600px",
        height: "100%",
        backgroundColor: "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "hidden"
    };

    return (
        <div 
            style={{...style}}
            className={`vidBlock ${content?.content_type} ${content?.template ? `template-${content?.template}` : ""
            }`}
        >
            {content && (
            <>
                <img
                    src={bgtask}
                    alt=""
                    style={{
                        paddingTop: "20px",
                        scale: "1.3",
                        overflow: "hidden",
                    }}
                    onClick={() => handleTaskClick(content)}
                    key={content.id}
                />
                <div
                    className={`contentTitle ${content.title.length > 15 ? "title-slider" : ""}`}>
                    <div className="title-slide">
                        <p style={{ margin: "0" }}>{content.title}</p>
                    </div>
                </div>
                <div className="taskHover" style={{ position: "absolute" }}>
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
                        handleEditTask(content);
                    }}
                    className="deleteBtn editBtn"
                >
                    <EditIcon sx={{ color: "black" }} />
                </button>
            </>
            )}
            {
                !content && (
                    <>
                        <div
                            className="thumbcontainer"
                        >
                            <img
                                src={bgtask || "placeholder.png"}
                                style={{
                                    marginBottom: "10px",
                                    scale: "1.3",
                                    overflow: "hidden",
                                }}
                                alt={"title"}
                                className="taskThumbnail"
                            />
                        </div>
                        <CirclePlus onClick={()=>handleAddTaskButton(node)}/>
                    </>
                )
            }
        </div>
    )
}

export default TaskNode