import React from 'react'
import VideoNode from './VideoNode'
import TaskNode from './TaskNode'

const ContentNode = ({node, video, task, openLesson, handleEditContent, 
    handleTaskClick, handleAddTaskButton, handleAddVideoButton, handleEditTask}) => {
    
    return (
        <div style={{
                display: "flex", 
                width: "600px", 
                gap: "2rem",
                padding: "2rem", 
                backgroundColor: "white",
                borderRadius: "2rem",
                position: "relative",
                overflow: "hidden",
                paddingTop: "50px"
            }}
        >
            {node.title && <p 
                style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    paddingTop: "1rem",
                    paddingBottom: "0.5rem",
                    width: "100%",
                    textAlign: "center",
                    background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
                    color: "white"
                }}
            >   
                {node.title} {`${node.description ? `(${node.description})` : ""}`}
            </p>}
            <VideoNode 
                node={node}
                content={video} 
                openLesson={openLesson} 
                handleEditContent={handleEditContent}
                handleAddVideoButton={handleAddVideoButton}
            />
            <TaskNode 
                node={node}
                content={task} 
                handleTaskClick={handleTaskClick} 
                handleEditContent={handleEditContent} 
                handleAddTaskButton={handleAddTaskButton}
                handleEditTask={handleEditTask}
            />
        </div>
    )
}

export default ContentNode