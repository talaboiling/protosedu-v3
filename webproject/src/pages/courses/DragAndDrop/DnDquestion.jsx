import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DroppablePlaceholder from '../DroppablePlaceholder'
import DraggableItem from '../DraggableItem'
import CustomDragLayer from '../CustomDragLayer'
import { DndContext, useDraggable } from '@dnd-kit/core'
import DraggableItem2 from '../DraggableItem2';

const DnDquestion = ({currentQuestion, drags, drops, checkCorrectAnswer}) => {

    const [answers, setAnswers] = useState([]);

    console.log(drags, drops);


    function handleDragEnd(event){
        const {active, over} = event;
        console.log(active, over);

        if (!over){
            return;
        }
        
        const optionId = active.id;
        const dropId = over.id;
        
        const answerIds = answers.map(current=>current.item);
        console.log(answerIds);
        if (answerIds.includes(dropId)){
            const index = answerIds.findIndex(element=> element===dropId);
            const currentAnswers = [...answers];
            currentAnswers[index] = {item:dropId, answer: optionId}
            console.log(index, currentAnswers); 
            setAnswers(currentAnswers);
        }else{
            setAnswers(prev=>[...prev, {item:dropId, answer: optionId}]);
        }
        if (currentQuestion.question_type==="drag_and_drop_images"){

            const existingAnswer = answers.find(answer => answer.item === over.id);
            if (existingAnswer) {
                // Get the draggable id that is already associated with this droppable.
                const previousDraggableId = existingAnswer.answer;
                const previousDraggableEl = document.getElementById(previousDraggableId);
                if (previousDraggableEl) {
                    const initialLeft = previousDraggableEl.getAttribute('data-initial-left');
                    const initialTop = previousDraggableEl.getAttribute('data-initial-top');
                    if (initialLeft !== null && initialTop !== null) {
                        // Reset the previous draggable element to its initial coordinates.
                        previousDraggableEl.style.left = `${initialLeft}px`;
                        previousDraggableEl.style.top = `${initialTop}px`;
                    }
                }
            }
            const activeEl = document.getElementById(active.id);
            const overEl = document.getElementById(over.id);
            activeEl.style.zIndex = 11;
            if (!activeEl || !overEl) return;

            const parent = activeEl.parentElement;
            const parentRect = parent.getBoundingClientRect();

            const overRect = overEl.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();

            Array.from(overEl.children).forEach(child => {
                if (child.id !== active.id) {
                  // Get the saved initial coordinates from data attributes.
                  const initialLeft = child.getAttribute('data-initial-left');
                  const initialTop = child.getAttribute('data-initial-top');
                  if (initialLeft !== null && initialTop !== null) {
                    // Reset the child's position to its initial coordinates.
                    child.style.left = `${initialLeft}px`;
                    child.style.top = `${initialTop}px`;
                  }
                }
            });

            const newLeft =
                (overRect.left - parentRect.left) +
                (overRect.width / 2) -
                (activeRect.width / 2);
            const newTop =
                (overRect.top - parentRect.top) +
                (overRect.height / 2) -
                (activeRect.height / 2);

            activeEl.style.left = `${newLeft}px`;
            activeEl.style.top = `${newTop}px`;
        }
    }; 

    useEffect(()=>{
        if (answers && answers.length>0){
            checkCorrectAnswer([...answers]);
        }
    }, [answers]);

    console.log(answers);

    return (
        <>
            <DndContext onDragEnd={handleDragEnd}>              
                {drops.length>0 && drops.map((drop) => {
                    console.log(drop);
                    const answer= answers.filter(ans=>ans.item==drop.id)[0];
                    console.log(answer)
                    return <DroppablePlaceholder
                        index={drop.id}
                        id={drop.id}
                        element={drop}
                        answer={answer}
                        showAnswer={currentQuestion.question_type==="drag_and_drop_text" ? true : false}
                    />
                })} 
                <div style={{
                        width: "30%", 
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    {currentQuestion.question_type=="drag_and_drop_text" && <ul className="studTaskOptions">
                        {currentQuestion.options.map((option, idx) => (
                            <DraggableItem option={option} idx={idx}/>
                        ))}
                    </ul>}
                    {currentQuestion.question_type=="drag_and_drop_images" && 
                        <>
                            {drags.map((element, idx) => (
                                <DraggableItem2 element={element} id={element.id}/>
                            ))}
                        </>
                    }
                </div>
            </DndContext>
        </>
    )
}

export default DnDquestion