import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas'
import ToolsBar from './ToolsBar'
import { initializeFabric, handleCanvasMouseDown, handleResize } from '../../../lib/canvas'
import {fabric} from "fabric";
import Settings from './canvas/Settings'
import TaskInterfaceProvider from './TaskContext'
import ToolsBar2 from './ToolsBar2';


const TaskInterface = ({
    currentQuestion,
    handleSelectCorrectAnswer,
    setContent,
    handleCorrectAnswer,
    content, 
    setCurrentQuestion,
    showDemo
}) => {
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const isDrawing = useState(false);
    const shapeRef = useState(null);
    const selectedShapeRef = useState("rectangle");
    const [canvas, setCanvas] = useState(null);

    useEffect(()=>{
        const initCanvas = initializeFabric({
            canvasRef, fabricRef
        });

        // initCanvas.on("mouse:down", (options)=>{
        //     handleCanvasMouseDown({
        //         options,
        //         canvas,
        //         isDrawing,
        //         selectedShapeRef,
        //         shapeRef,
        //     })
        // });

        setCanvas(initCanvas);

        return () => {
            initCanvas.dispose();
        }

        // window.addEventListener("resize", () => {
        //     handleResize({fabricRef});
        // });
    }, []);

    const addRectangle = () => {
        if (canvas){
            const rectangle = new fabric.Rect({
                top:100,
                left:50,
                width:100,
                height:100,
                fill: "#d84d42"
            });
            canvas.add(rectangle);
        }
    }

    const addCircle = () => {
        if (canvas){
            const circle = new fabric.Circle({
                top:100,
                left:50,
                radius:50,
                fill: "#2f4dc6"
            });
            canvas.add(circle);
        }
    }

    const onBackspace = (event) => {
        if (event.key=="Backspace"){
            console.log("pressed");
        }
    }

    console.log(currentQuestion);

    return (
        <div className="taskCreationHeader">
            <TaskInterfaceProvider setCurrentQuestion={setCurrentQuestion} handleCorrectAnswer={handleCorrectAnswer} setContent={setContent} canvas={canvas} currentQuestion={currentQuestion} content={content}>
                <ToolsBar2 canvas={canvas} />
                <div style={{position: "relative", display: "inline-block", height: "100%"}}>
                    <Canvas onBackspace={onBackspace} canvasRef={canvasRef} currentQuestion={currentQuestion} handleSelectCorrectAnswer={handleSelectCorrectAnswer}/>
                    {showDemo && <div 
                        id="canvas-overlay"
                        className="taskPreview"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.8)",
                            padding: "10px",
                            boxSizing: "border-box",
                        }}
                    >
                        <p
                            className="defaultStyle"
                            style={{
                                margin: "0",
                                padding: "20px",
                                maxWidth: "500px",
                                maxHeight: "70px",
                                fontSize: "x-large",
                                textWrap: "wrap",
                                textOverflow: "ellipsis",
                                textAlign: "center",
                            }}
                        >
                            {currentQuestion.title}
                        </p>
                        <div className="previewContent">
                            <p
                                style={{
                                    margin: "0",
                                    fontSize: "xx-large",
                                    maxWidth: "500px",
                                    height: "100%",
                                    textWrap: "wrap",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                    marginBottom: "150px"
                                }}
                            >
                                {currentQuestion.question_text}
                            </p>
                            <div className="previewOptions">
                                {currentQuestion.options.map((option, index) => {
                                    if (!option){
                                        return;
                                    }
                                    return <div
                                        key={index}
                                        className={`previewOption ${
                                            currentQuestion.correct_answer === index + 1
                                            ? "correct-answer"
                                            : ""
                                        }`}
                                        onClick={() => handleSelectCorrectAnswer(index)}
                                    >
                                    {currentQuestion.question_type ==
                                        "multiple_choice_text" && (
                                            <p>{option}</p>
                                        )}
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>}
                </div>
                <ToolsBar canvas={canvas} functions={{addRectangle, addCircle}} />
            </TaskInterfaceProvider>
        </div>
    )
}

export default TaskInterface