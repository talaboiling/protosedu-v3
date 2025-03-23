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
    content
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


    return (
        <div className="taskCreationHeader">
            <TaskInterfaceProvider handleCorrectAnswer={handleCorrectAnswer} setContent={setContent} canvas={canvas} currentQuestion={currentQuestion} content={content}>
                <ToolsBar2 canvas={canvas} />
                <Canvas onBackspace={onBackspace} canvasRef={canvasRef} currentQuestion={currentQuestion} handleSelectCorrectAnswer={handleSelectCorrectAnswer}/>
                <ToolsBar canvas={canvas} functions={{addRectangle, addCircle}} />
            </TaskInterfaceProvider>
        </div>
    )
}

export default TaskInterface