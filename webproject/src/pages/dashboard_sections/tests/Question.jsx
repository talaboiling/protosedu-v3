import React from 'react'
import Answers from './Answers'
const Question = ({questionData, onSkip, selectedAnswer, answerState, onSelect}) => {
    console.log(questionData);
    return (
        <div id='question'>
                <p style={{fontSize: "20px"}}>{questionData.order}. {questionData.title}</p>
                <Answers 
                    answers={questionData.answer_options}
                    selectedAnswer = {selectedAnswer}
                    answerState = {answerState}
                    onSelect = {onSelect}
                />
            </div>
    )
}

export default Question