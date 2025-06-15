import React from 'react'
import { Circle, CirclePlus, EditIcon } from 'lucide-react';
import bgvideo from "../../assets/videolessonthumb.svg";
const VideoNode = ({node, content, openLesson, handleEditContent, handleAddVideoButton}) => {
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
                <div
                    className="thumbcontainer"
                    onClick={() => openLesson(content)}
                    key={content.id}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditContent(content);
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
                    className={`contentTitle ${content.title.length > 20 ? "title-slider" : ""}`}
                >
                    <div className="title-slide">
                        <p style={{ margin: "0" }}>{content.title}</p>
                    </div>
                </div>
                <div className="taskHover" style={{ position: "absolute", left: 0 }}>
                    <p>
                        <strong>Название:</strong> {content.title}
                    </p>
                    <p>
                        <strong>Описание:</strong> {content.description}
                    </p>
                </div>
            </>
            )}
            {
                !content && (
                    <>
                        <div
                            className="thumbcontainer"
                        >
                            <img
                                src={bgvideo || "placeholder.png"}
                                alt={"title"}
                                className="taskThumbnail"
                            />
                        </div>
                        <CirclePlus onClick={()=>handleAddVideoButton(node)}/>
                    </>
                )
            }
      </div>
    )
}

export default VideoNode