import React from 'react'
import Answers from './Answers'
const Question = ({id, questionData, onSkip, selectedAnswer, 
    answerState, onSelect, index, mode, isCorrect}) => {
    console.log(questionData, isCorrect);
    return (
        <div id={id ? id : 'question'}>
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
            </div>
    )
}

export default Question