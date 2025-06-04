import React from 'react'
import Answers from './Answers'
import { answerTestQuestion } from '../../../utils/apiService';
import { toast } from 'react-toastify';
const Question = ({id, questionData, onSkip, selectedAnswer, 
    answerState, onSelect, index, mode, isCorrect, currentAnswerId, goNext}) => {
    console.log(questionData, isCorrect);

    const submitQuestionAnswer = async () => {
        try {
            const data = await answerTestQuestion(questionData.id, currentAnswerId);
            console.log(data);
            goNext();
        } catch(e){
            toast.error(e.message || `Error happened`);
        }
    }
    
    return (
        <div id={id ? id : 'question'} style={{position: "relative"}}>
            <p style={{fontSize: "20px"}}>{questionData.order}. {questionData.title}</p>
            <Answers 
                answers={questionData.answer_options}
                selectedAnswer = {selectedAnswer}
                answerState = {answerState}
                onSelect = {onSelect}
                index={index}
                mode={mode}
                isCorrect={isCorrect}
            />
            {mode!="review" && <button style={{position: "absolute", right: "20px", bottom: "0px"}} onClick={submitQuestionAnswer}>Ответить</button>}
        </div>
    )
}

export default Question