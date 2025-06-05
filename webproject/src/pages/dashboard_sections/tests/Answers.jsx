import { Maximize2 } from 'lucide-react';
import React, { useState } from 'react'
import classes from './Answers.module.css'
import Modal from '../../../helpers/Modal';
import HPBs_Form from './HPBs_Form';

const Answers = ({answers,selectedAnswer,answerState, onSelect, index, mode, isCorrect}) => {
    console.log(selectedAnswer, answers, answerState);

    const [showModal, setShowModal] = useState(false);
    const [answerImage, setAnswerImage] = useState(null);
    const [answerIndex, setAnswerIndex] = useState(null);

    function viewImageHandler(e, answerImage, answerIndex){
        e.stopPropagation();
        setShowModal(true);
        setAnswerImage(answerImage);
        setAnswerIndex(answerIndex);
    }

    return (
        <ul id='answers'>
            {answers.map(answer=>{
                let isSelected = false;
                if (selectedAnswer && selectedAnswer.text === answer.text){
                    if (answer.option_type=="image" && selectedAnswer.image==answer.image){
                        isSelected = true;
                    }else if (answer.option_type=="text" && selectedAnswer.text==answer.text){
                        isSelected = true;
                    }
                    
                }
                let cssClasses = ''
                if (isSelected){
                    cssClasses = 'selected';
                    if (selectedAnswer.is_correct){
                        answerState="correct";
                    }else{
                        answerState="wrong";
                    }
                }
                if ((answerState==='correct' || answerState==='wrong') && isSelected){
                    cssClasses = answerState
                }

                if (mode==="review"){
                    if (answer.option_type==="text"){
                        return (
                            <li key={answer.id} className='answer'>
                                <button key={answer.id}
                                    style={{backgroundColor: cssClasses ? cssClasses==="correct" ? "green" : "red" : ""}}
                                >
                                    {answer.text}
                                </button>
                            </li>
                        )
                    }else if (answer.option_type==="image"){
                        return <li key={answer.id} className='answer'>
                                <button key={answer.id}
                                    style={{backgroundColor: cssClasses ? cssClasses==="correct" ? "green" : "red" : ""}}
                                >
                                    <img src={answer.image} style={{width: "100px"}}/>
                                </button>
                        </li>
                    }
                }
                if (answer.option_type==="text"){
                    return (
                        <li key={answer.id} className='answer'>
                            <button key={answer.id} onClick={()=>onSelect(answer, index)} 
                                style={{backgroundColor: isSelected ? "green" : ""}}
                            >
                                {answer.text}
                            </button>
                        </li>
                    )
                }else if (answer.option_type==="image"){
                    return <li key={answer.id} className='answer'>
                        <button key={answer.id}
                            onClick={()=>onSelect(answer, index)} 
                            style={{backgroundColor: isSelected ? "green" : "", position:"relative"}}
                            className={classes['answer-button']}
                        >
                            <img src={answer.image} style={{width: "100px"}}/>
                            <div className={classes['maximize-btn-bg']}>
                                <Maximize2 
                                    size={20} 
                                    className={classes['maximize-btn']} 
                                    onClick={(e)=>viewImageHandler(e, answer, index)}
                                />
                            </div>
                        </button>
                    </li>
                }
            })}
            {showModal && answerImage && answerIndex && <Modal onClose={()=>{
                setShowModal(false);
                setAnswerImage(null);
            }} extraStyles={{width:"400px"}}>
                <form style={{width:"100%", display:"flex", 
                flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <img src={answerImage?.image} style={{width:"100%"}}/>
                    {(!selectedAnswer || selectedAnswer.image!==answerImage.image) && <button style={{width: "fit-content"}} onClick={()=>onSelect(answerImage, answerIndex)}>
                        Выбрать как ответ
                    </button>}
                    {selectedAnswer && selectedAnswer.image===answerImage.image && <button type='button' style={{width: "fit-content", backgroundColor: "green"}}>
                        Выбран как ответ
                    </button>}
                </form>
            </Modal>}
        </ul>
    )
}

export default Answers