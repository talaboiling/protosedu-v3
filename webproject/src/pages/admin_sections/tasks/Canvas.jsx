import React from 'react'
import { useContext, useEffect } from 'react'
import { TaskInterfaceContext } from './TaskContext'

const Canvas = ({
    currentQuestion,
    handleSelectCorrectAnswer,
    canvasRef
}) => {
    const {onPaste, onFocus, selectedObject} = useContext(TaskInterfaceContext);
    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(onFocus)
            if (!onFocus){
                // if (event.key === "Backspace") {
                //     console.log("Backspace pressed!");
                //     onBackspace();
                // }
                if ((event.ctrlKey || event.metaKey) && event.key === "c") {
                    console.log("Copy detected (Ctrl/Cmd + C)");
                }
                if ((event.ctrlKey || event.metaKey) && event.key === "v") {
                    console.log("Paste detected (Ctrl/Cmd + V)");
                    onPaste();
                }
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [onFocus, selectedObject]);
    return (
        <canvas className={` ${
            currentQuestion.template ? `template-${currentQuestion.template}` : ""
        }`} id="canvas" ref={canvasRef} style={{width: "640px", height: "100%"}}
        >
        </canvas>
    )
}

export default Canvas