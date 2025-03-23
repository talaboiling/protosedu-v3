import { Children, createContext, useState, useRef, useEffect, useCallback } from "react";
export const TaskInterfaceContext = createContext(null);
import { handleObjectMoving, clearGuidelines } from "./canvas/snappingHelpers";
import { fabric } from "fabric";

const TaskInterfaceProvider = ({children, canvas, setCanvas, currentQuestion, setContent,handleCorrectAnswer,content}) => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [properties, setProperties] = useState({
        width: "",
        height: "",
        diameter: "",
        color: "#fff"
    });
    const [onFocus, setOnFocus] = useState(false);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [questionType, setQuestionType] = useState(null);
    const [isChoosingDropZone, setIsChoosingDropZone] = useState(null);
    const [dropZones, setDropZones] = useState(new Map());
    const [isLinkingDnd, setIsLinkingDnd] = useState(false);
    const [isClickingLogic, setIsClickingLogic] = useState(null);
    const [links, setLinks] = useState([]);
    const [correctClickImage, setCorrectClickImage] = useState(null);
    const [isChoosingInputZone, setIsChoosingInputZone] = useState(null);
    const [inputZones, setInputZones] = useState([]);

    const addDropZone = (object) => {
        setDropZones(prev => {
            const newDropZones = new Map(prev);
            newDropZones.set(object.id, object);
            return newDropZones;
        });
    };

    console.log(questionType, dropZones, isChoosingDropZone, canvas)
    useEffect(()=>{
        if (currentQuestion){
            setQuestionDetails(currentQuestion);
            setQuestionType(currentQuestion.question_type);
        }
    }, [currentQuestion]);

    const [currentCanvas, setCurrentCanvas] = useState(null);
    console.log(canvas);
    const clearSettings = () => {
        setProperties({
            width: "",
            height: "",
            diameter: "",
            color: "#fff"
        });
    };
    const canvasRef = useRef(canvas); 
    const [guidelines, setGuideLines] = useState([]);

    useEffect(() => {
        if (canvas){
            setCurrentCanvas(canvas);
            canvasRef.current = canvas;
            canvas.on("object:moving", event => {
                handleObjectMoving(canvas, event.target, guidelines, setGuideLines);
            })

            canvas.on("object:modified", event => {
                clearGuidelines(canvas, guidelines, setGuideLines);
            })
        }
    }, [canvas]);

    useEffect(()=>{
        if (canvas && guidelines){
            console.log(guidelines);
            canvas.renderAll();
        }
    }, [guidelines])

    const setProperty = (name, value) => {
        setProperties(prev=>({...prev, [name]:value}));
    }

    // const onBackspace = useCallback(() => {
    //     console.log("Canvas inside onBackspace:", Boolean(canvas), canvas);
    //     if (canvas && selectedObject) {
    //         canvas.remove(selectedObject);
    //         setSelectedObject(null);
    //         canvas.renderAll();
    //     } else {
    //         console.log("Canvas or selectedObject is missing.");
    //     }
    // }, [canvas, selectedObject]);

    function addImage(imageSrc){   
        console.log(imageSrc, canvas);
        if (canvas) {
            fabric.Image.fromURL(imageSrc, (img) => {
              img.scaleToWidth(100);
              img.scaleToHeight(100);
              img.set({
                left: (canvas.width - img.getScaledWidth()) / 2,
                top: (canvas.height - img.getScaledHeight()) / 2,
                selectable: true,
                lockUniScaling: true,
              });
              img.setControlsVisibility({
                mt: false, // top middle
                mb: false, // bottom middle
                ml: false, // middle left
                mr: false, // middle right
              });
              canvas.add(img);
              console.log(img);
              canvas.renderAll();
            });
          }
    }

    const onPaste = () => {
        console.log(selectedObject, canvas);
        if (selectedObject && canvas){
            if (canvas && selectedObject.type=="circle"){
                const circle = new fabric.Circle({
                    top:100,
                    left:50,
                    radius:properties.diameter/2,
                    fill: "#2f4dc6"
                });
                canvas.add(circle);
            }else if (canvas && selectedObject.type=="rect"){
                console.log(properties);
                const rectangle = new fabric.Rect({
                    top:100,
                    left:50,
                    width:properties.width,
                    height:properties.height,
                    fill: "#d84d42"
                });
                canvas.add(rectangle);
            }
        }
    }

    const handleSaveClick = () => {
        if (questionType=="drag_and_drop_text"){
            setContent({
                dropZones: Array.from(dropZones.values()),
                canvasData: canvas
            });
        } else if (questionType=="drag_and_drop_images"){

            const linkIds = [];
            links.forEach(link=>{
                linkIds.push(link.item);
                linkIds.push(link.answer);
            })
            
            canvas._objects.forEach(item => {
                if (item.type === "image" && !linkIds.includes(item.id)) {
                    item.metadata = { isLink: true, isDrag: true, isDrop: false };
                }
            });

            const droppables = [];

            const correctLinks = links.filter(link=>{
                if (link.answer && !droppables.includes(link.item)){
                    droppables.push(link.item);
                    return link;
                }
            })
            setContent({
                links: [...correctLinks],
                canvasData: canvas,
                correctAnswer: [...correctLinks]
            });
            handleCorrectAnswer([...correctLinks]);
        }else if (questionType=="click_image"){

            canvas._objects.forEach(item => {
                if (item.type === "image") {
                    console.log(item.type, item.id);
                    item.metadata = { isClick: true };
                }
            });
            setContent({
                canvasData: canvas,
            });
            handleCorrectAnswer(correctClickImage);
        }else if (questionType=="input_text"){
            setContent({
                canvasData: canvas,
            });
            handleCorrectAnswer([...inputZones]);
        }else{
            setContent({
                canvasData: canvas,
            });
        }
    }  

    console.log(content, currentQuestion);
    

    console.log(links);
    function removeObject(){
        if (selectedObject && canvas){
            canvas.remove(selectedObject);
            canvas.renderAll();
        }
    }

    return (
        <TaskInterfaceContext.Provider value={
            {selectedObject, setSelectedObject, 
                properties, setProperty, clearSettings, onPaste,
                onFocus, setOnFocus, questionDetails, questionType, 
                setQuestionType, isChoosingDropZone, setIsChoosingDropZone,
                dropZones, addDropZone, handleSaveClick, addImage, removeObject,
                isLinkingDnd, setIsLinkingDnd, links, setLinks,
                isClickingLogic, setIsClickingLogic, correctClickImage, setCorrectClickImage,
                isChoosingInputZone, setIsChoosingInputZone, inputZones, setInputZones
            }}
        >
            {children}
        </TaskInterfaceContext.Provider>
    )
}

export default TaskInterfaceProvider;