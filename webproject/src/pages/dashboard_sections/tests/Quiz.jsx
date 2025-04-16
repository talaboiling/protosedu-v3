import React, { useState, useCallback, useEffect } from 'react';
import classes from "./Quiz.module.css";

import Question from './Question'
import FooterNavigation from './FooterNavigation';
import MainNavigation from './MainNavigation';
import QuizReview from './QuizReview';
const Quiz = ({questions}) => {
    const [userAnswers, setUserAnswers] = useState([]);
    const [answerState, setAnswerState] = useState('unanswered');
    const [currentAnswer, setCurrentAnswer] = useState();
    const [currentAnswerIndex, setCurrentAnswerIndex] = useState(-1);
    console.log(userAnswers);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [quizState, setQuizState] = useState("quiz");

    const handleSelectAnswer = useCallback((selectedAnswer, index) =>{
        const {text: answerText, is_correct} = selectedAnswer;
        console.log(selectedAnswer);
        setCurrentAnswer(answerText);
        setCurrentAnswerIndex(index);
        setAnswerState('answered')
        const currentUserAnswers = [...userAnswers];
        currentUserAnswers[index] = {...selectedAnswer, index};
        setUserAnswers(currentUserAnswers);
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
    },[answerState, activeQuestionIndex])

    // const handleSkipAnswer = useCallback(() =>
    //     handleSelectAnswer(null)
    // ,[handleSelectAnswer])

    useEffect(()=>{
        if (questions){
            setUserAnswers(Array.from({length: questions.length}, ()=>null));
        }
    }, []);

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

    function goNext(){
        setActiveQuestionIndex(prev=>{
            if (prev<questions.length){
                return prev+1;
            }
            return prev;
        });
    }

    function goBack(){
        setActiveQuestionIndex(prev=>{
            if (prev>0){
                return prev-1;
            }
            return prev;
        });
    }

    function finishQuiz(){
        if (userAnswers.filter(userAnswer=>userAnswer!=null).length==questions.length){
            setQuizState("review");
        }
    }

    function navigateToQuestion(index){
        setActiveQuestionIndex(index);
    }

    function navigateToQuestionInReview(questionId){
        const questionElement = document.getElementById(questionId);
        questionElement?.scrollIntoView({
            behavior: 'smooth'
        })
        console.log(questionElement, questionId);
    }

    console.log(userAnswers)
    return (
        <div className={classes['quiz']}>
            <div className={classes['quiz-left']}>
                {quizState==="quiz" &&  
                <>
                    <div className={classes['quiz-content']}>
                        <Question
                            key={activeQuestionIndex}
                            index={activeQuestionIndex}
                            questionData={questionData} 
                            // onSkip={handleSkipAnswer} 
                            answerState={answerState}
                            selectedAnswer={userAnswers[activeQuestionIndex]}
                            onSelect = {handleSelectAnswer}
                        />
                    </div>
                    <FooterNavigation 
                        activeQuestionIndex={activeQuestionIndex} 
                        goNext={goNext} 
                        goBack={goBack}
                        length={questions.length}
                        finishQuiz={finishQuiz}
                    />
                </>
                }
                {quizState==="review" && (
                    <QuizReview
                        questions={questions}
                        userAnswers={userAnswers}
                    />
                )}
            </div>
            <div className={classes['quiz-right']}>
                <MainNavigation 
                    questions={questions} 
                    userAnswers={userAnswers} 
                    navigateToQuestion={navigateToQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    mode={quizState==="quiz" ? "quiz" : "review"}
                    navigateToQuestionInReview={navigateToQuestionInReview}
                />
            </div>
        </div>
    )
}

export default Quiz