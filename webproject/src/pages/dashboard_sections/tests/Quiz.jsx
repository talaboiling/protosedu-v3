import React, { useState, useCallback } from 'react'

import Question from './Question'
const Quiz = ({questions}) => {
    const [userAnswers, setUserAnswers] = useState([]);
    const [answerState, setAnswerState] = useState('unanswered');
    const [currentAnswer, setCurrentAnswer] = useState();
    console.log(userAnswers);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const activeQuestionIndex = answerState==='unanswered'? userAnswers.length: userAnswers.length-1

    const handleSelectAnswer = useCallback((selectedAnswer) =>{
        const {text: answerText, is_correct} = selectedAnswer;
        console.log(selectedAnswer);
        if (currentAnswer==answerText){
            return;
        }
        setCurrentAnswer(answerText);
        setAnswerState('answered')
        setUserAnswers(prev=>[...prev,answerText])
        if (is_correct){
            setCorrectAnswers(prev=>prev+1);
        }

        // setTimeout(()=>{
        //     if (selectedAnswer===questions[activeQuestionIndex].answers[0]){
        //         setAnswerState('correct')
        //     }else{
        //         setAnswerState('wrong')
        //     }

        //     setTimeout(()=>{
        //         setAnswerState('unanswered')
        //     },1000)
        // },1000)
        setTimeout(()=>{
            setAnswerState('unanswered')
        },1000)
    },[activeQuestionIndex, answerState])

    // const handleSkipAnswer = useCallback(() =>
    //     handleSelectAnswer(null)
    // ,[handleSelectAnswer])

    if (activeQuestionIndex>=questions.length){
        return (
            <div id='summary'>
                {/* <img src="/src/assets/quiz-complete.png" alt="complete-icon" /> */}
                <h2>QUIZ FINISHED</h2>
                <p style={{fontSize: "28px"}}>{correctAnswers}/{questions.length}</p>
            </div>
        )
    }
    const questionData = questions[activeQuestionIndex]

  return (
    <div id='quiz'>
        <Question 
            key={activeQuestionIndex}
            questionData={questionData} 
            // onSkip={handleSkipAnswer} 
            answerState={answerState}
            selectedAnswer={userAnswers[userAnswers.length-1]}
            onSelect = {handleSelectAnswer}
        />
    </div>
  )
}

export default Quiz