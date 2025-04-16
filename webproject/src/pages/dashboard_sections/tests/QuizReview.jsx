import React from 'react'
import Question from './Question'
import classes from "./Quiz.module.css";

const QuizReview = ({questions, userAnswers}) => {
    console.log(questions, userAnswers);
  return (
    <div className={classes['quiz-content']}>
        {questions.map((question, index)=>{
            return <Question
                id={`question${index}`}
                questionData={question}
                selectedAnswer={userAnswers[index]}
                answerState={"answered"}
                mode={"review"}
                isCorrect={userAnswers[index].is_correct}
            />
        })}
    </div>
  )
}

export default QuizReview