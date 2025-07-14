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
    const correctAnswer = questionData.answer_options.find(answer_option=>answer_option.is_correct==true);
    console.log(correctAnswer);
    return (
        <div id={id ? id : 'question'} style={{position: "relative"}}>
            <p style={{fontSize: "20px"}}>{index+1}. {questionData.title}</p>
            {questionData?.contents && questionData.contents.map(content=>{
                if (content?.content_type==="text"){
                    return <p style={{fontSize:"16px"}}>{content.text}</p>
                }else if (content?.content_type==="image"){
                    return <img src={content.image} style={{maxHeight:"300px"}}/>
                }
            })}
            <Answers 
                answers={questionData.answer_options}
                selectedAnswer = {selectedAnswer}
                answerState = {answerState}
                onSelect = {onSelect}
                index={index}
                mode={mode}
                isCorrect={isCorrect}
            />
            {mode==="review" && correctAnswer && <div style={{fontWeight: "bold"}}>Правильный ответ: {correctAnswer.option_type==="text" ? <span>{correctAnswer.text}</span> : <img src={correctAnswer.image} style={{width:"200px"}}/>}</div>}
            {mode!="review" && <button style={{position: "absolute", right: "20px", bottom: "0px"}} onClick={submitQuestionAnswer}>Ответить</button>}
        </div>
    )
}

export default Question