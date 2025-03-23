import React, { useEffect, useRef, useState } from 'react'
import Dimensions from './tools/Dimensions'
import Text from './tools/Text'
import Color from './tools/Color'
import Export from './tools/Export'
import {Square, MousePointer2, Cable, MousePointer, CirclePlus} from "lucide-react"
import { Circle } from 'lucide-react'
import { CaseSensitive } from 'lucide-react'
import Settings from './canvas/Settings'
import LayerList from './canvas/LayersList'
import {fabric} from "fabric";
import { useContext } from 'react'
import { TaskInterfaceContext } from './TaskContext'
import DropZones from './DropZones'
import { ImageUp } from 'lucide-react'
import ImageGrid from './canvas/ImageGrid'
import { Trash2 } from 'lucide-react'
import classes from "./canvas/LayersList.module.css"

const ToolsBar2 = ({functions, canvas}) => {

    const {
        onFocus, setOnFocus, questionType, setIsChoosingDropZone, 
        isChoosingDropZone, handleSaveClick, addImage, removeObject,
        isLinkingDnd, setIsLinkingDnd, isClickingLogic, 
        setIsClickingLogic, links, inputZones, setInputZones
    } = useContext(TaskInterfaceContext);
    console.log(questionType);

    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [canvasObjects, setCanvasObjects] = useState({
        texts: [],
        images: [],
        circles: [],
        rects: []
    });

    const addItToObject = (object) => {
        if (!object.id){
            const timestamp = new Date().getTime();
            object.id = `${object.type}_${timestamp}`;
        }
    }

    fabric.Canvas.prototype.updateIds = function (){
        const objects = this.getObjects();
        objects.forEach((object, index)=>{
            addItToObject(object);
        })
    };


    const updateElements = () => {
        if (canvas){
            canvas.updateIds();
            let objects = canvas.getObjects().filter(obj=>!obj.id.startsWith("vertical-") && !obj.id.startsWith("horizontal-"));
            const textObjects = objects.filter(object=>object.type=="text" || object.type=="i-text").map((obj)=>(obj.id));;
            const imageObjects = objects.filter(object=>object.type=="image").map((obj)=>(obj.id));;
            const circleObjects = objects.filter(object=>object.type=="circle").map((obj)=>(obj.id));;
            const rectObjects = objects.filter(object=>object.type=="rect").map((obj)=>(obj.id));;
            
            setCanvasObjects({
                texts: textObjects,
                images: imageObjects,
                circles: circleObjects,
                rects: rectObjects
            });
        }
    };

    console.log(canvasObjects);



    const handleObjectSelected = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null;

        if (selectedObject){
            setSelectedLayer(selectedObject.id);
        }else{
            setSelectedLayer(null);
        }
    };

    const selectedLayerInCanvas = (layerId) => {
        const object = canvas.getObjects().find(obj=>obj.id===layerId);

        if (object){
            canvas.setActiveObject(object);
            canvas.renderAll();
        }
    };

    useEffect(()=>{
        if (canvas){
            canvas.on("object:added", updateElements);
            canvas.on("object:removed", updateElements);
            canvas.on("object:modified", updateElements);

            canvas.on("selection:created", handleObjectSelected);
            canvas.on("selection:updated", handleObjectSelected);
            canvas.on("selection:cleared", ()=> setSelectedLayer(null));

            updateElements();

            return () => {
                canvas.off("object:added", updateElements);
                canvas.off("object:removed", updateElements);
                canvas.off("object:modified", updateElements);

                canvas.off("selection:created", handleObjectSelected);
                canvas.off("selection:updated", handleObjectSelected);
                canvas.off("selection:cleared", ()=> setSelectedLayer(null));
            }
        }
    }, [canvas]);

    const handleAddAnswer = (iIndex) =>{
        const currentInputZones = [...inputZones];
        currentInputZones[iIndex].answers = [...currentInputZones[iIndex].answers, ""];
        setInputZones(currentInputZones);
    }

    const handleAnswerChange = (e, iIndex, aIndex) => {
        const currentInputZones = [...inputZones];
        currentInputZones[iIndex].answers[aIndex] = e.target.value;
        setInputZones(currentInputZones);
    }

    console.log(inputZones);
    
    
    return (
        <section className="taskToolsBar" style={{overflowY: "auto", height: "500px"}}>
          <div className='taskToolsBar_header'>
            {canvasObjects && <div style={{width: "100%"}}>
                <p>Texts</p>
                <ul style={{fontSize: "18px"}}>
                    {canvasObjects.texts.map(textElement=>(
                        <li key={textElement} onClick={()=>{selectedLayerInCanvas(textElement)}}
                            className={textElement===selectedLayer ? classes["selected-layer"] : ""}
                        >
                            {textElement}
                        </li>
                    ))}
                </ul>
                <p>Images</p>
                <ul style={{fontSize: "18px"}}>
                    {canvasObjects.images.map(imageElement=>(
                        <li key={imageElement} onClick={()=>{selectedLayerInCanvas(imageElement)}}
                            className={imageElement===selectedLayer ? classes["selected-layer"] : ""}
                        >
                            {imageElement}
                        </li>
                    ))}
                </ul>
                <p>Circle</p>
                <ul style={{fontSize: "18px"}}>
                    {canvasObjects.circles.map(circleElement=>(
                        <li key={circleElement} onClick={()=>{selectedLayerInCanvas(circleElement)}}
                            className={circleElement===selectedLayer ? classes["selected-layer"] : ""}
                        >
                            {circleElement}
                        </li>
                    ))}
                </ul>
                <p>Rects</p>
                <ul style={{fontSize: "18px"}}>
                    {canvasObjects.rects.map(rectElement=>(
                        <li key={rectElement} onClick={()=>{selectedLayerInCanvas(rectElement)}}
                            className={rectElement===selectedLayer ? classes["selected-layer"] : ""}
                        >
                            {rectElement}
                        </li>
                    ))}
                </ul>
                {questionType=="drag_and_drop_images" && links.length>0 && 
                    <>
                        <p>Drag and Drop Links</p>
                        <ul style={{fontSize: "18px"}}>
                            {canvasObjects.texts.map(textElement=>(
                                <li key={textElement} onClick={()=>{selectedLayerInCanvas(textElement)}}
                                    className={textElement===selectedLayer ? classes["selected-layer"] : ""}
                                >
                                    {textElement}
                                </li>
                            ))}
                        </ul>
                    </>
                }
                {questionType=="input_text" && inputZones.length>0 && 
                    <>
                        <p>Input Zones</p>
                        <ul style={{fontSize: "18px"}}>
                            {inputZones.map((inputZone, iIndex)=>(
                                <>
                                    <li key={inputZone.item} onClick={()=>{selectedLayerInCanvas(inputZone.item)}}
                                        className={inputZone.item===selectedLayer ? classes["selected-layer"] : ""}
                                    >
                                        <p style={{fontSize: "14px", margin: "0"}}>{inputZone.item}</p>
                                        <div style={{width: "80%", margin: "auto"}}>
                                            <div style={{width: "100%", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
                                                <p style={{fontSize: "14px"}}>Answers</p>
                                                <CirclePlus size={18} onClick={()=>handleAddAnswer(iIndex)} style={{cursor: "pointer"}}/>
                                            </div>
                                            <ul>
                                                {inputZone.answers.map((answer, aIndex)=>(
                                                    <input placeholder='Enter value' value={answer} onChange={(e)=>handleAnswerChange(e, iIndex, aIndex)}/>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>

                                </>
                            ))}
                        </ul>

                    </>
                }
            </div>}
          </div>
        </section>
      )
}

export default ToolsBar2