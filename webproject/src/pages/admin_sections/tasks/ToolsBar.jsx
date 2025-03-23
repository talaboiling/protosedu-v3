import React, { useEffect, useRef, useState } from 'react'
import Dimensions from './tools/Dimensions'
import Text from './tools/Text'
import Color from './tools/Color'
import Export from './tools/Export'
import {Square, MousePointer2, Cable, MousePointer} from "lucide-react"
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

const ToolsBar = ({functions, canvas}) => {
  const {addRectangle, addCircle} = functions;
  const {
    onFocus, setOnFocus, questionType, setIsChoosingDropZone, 
    isChoosingDropZone, handleSaveClick, addImage, removeObject,
    isLinkingDnd, setIsLinkingDnd, isClickingLogic, 
    setIsClickingLogic, isChoosingInputZone, setIsChoosingInputZone
  } = useContext(TaskInterfaceContext);

  console.log(questionType)

  const fileInputRef = useRef(null);

  const addText = () => {
    if (canvas){
        const iText = new fabric.IText("Double-click to edit", {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: "#000000",
            fontFamily: "Arial",
        });

        iText.on("editing:entered", (event) => {
          setOnFocus(true);
        })

        iText.on("editing:exited", (event) => {
          setOnFocus(false);
        })

        console.log(iText)
        canvas.add(iText);
        canvas.renderAll();
    }
  }

  const handleDnDlogicClick = () => {
    setIsChoosingDropZone(true);
  }

  function handleImageAdd(){
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file); // This is a string URL.
      console.log(fileURL);
      addImage(fileURL);
    }
  };
  return (
    <section className="taskToolsBar" style={{overflowY: "auto", height: "500px"}}>
      <div className='taskToolsBar_header'>
        <Square size={40} onClick={addRectangle}/>
        <Circle size={40} onClick={addCircle}/>
        <CaseSensitive size={40} onClick={addText}/>
        <ImageUp size={38} onClick={handleImageAdd}/>
        <Trash2 size={36} onClick={removeObject}/>
        <input 
          ref={fileInputRef} 
          style={{display: "none"}} 
          type='file'
          onChange={handleFileChange} 
        />
        {/* <Text/>
        <Color/>
        <Color/>
        <Export/> */}
      </div>
      {/* <DropZones/> */}
      {questionType==="drag_and_drop_text" && 
        <div className='taskToolsBar_dropzone_options' style={{color: isChoosingDropZone ? "blue" : "inherit"}} onClick={handleDnDlogicClick}>
          <MousePointer2/>
          <p>Выбрать зону дропа</p>
        </div>
      }
      {questionType==="drag_and_drop_images" && 
        <div className='taskToolsBar_dropzone_options' style={{color: isLinkingDnd ? "orange" : "inherit"}} onClick={()=>setIsLinkingDnd(true)}>
          <Cable/>
          <p>Связать</p>
        </div>
      }
      {questionType==="click_image" && 
        <div className='taskToolsBar_dropzone_options' style={{color: isClickingLogic ? "green" : "inherit"}} onClick={()=>setIsClickingLogic(true)}>
          <MousePointer/>
          <p>Правильная картинка</p>
        </div>
      }
      {questionType==="input_text" && 
        <div className='taskToolsBar_dropzone_options' style={{color: isChoosingInputZone ? "purple" : "inherit"}} onClick={()=>setIsChoosingInputZone(true)}>
          <MousePointer/>
          <p>Выбрать Зону Ввода</p>
        </div>
      }
      <Settings canvas={canvas}/>
      <LayerList canvas={canvas}/>
      <ImageGrid addImage={addImage}/>
      <button onClick={handleSaveClick}>
        Save
      </button>
    </section>
  )
}

export default ToolsBar