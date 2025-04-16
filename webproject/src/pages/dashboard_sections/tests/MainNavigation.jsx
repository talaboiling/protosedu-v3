import React from 'react'
import classes from "./Quiz.module.css";

const MainNavigation = ({questions, userAnswers, navigateToQuestion, 
    activeQuestionIndex, mode, navigateToQuestionInReview}) => {
    console.log(questions, userAnswers);
    const indeces = userAnswers.map((answer,index)=>{
        if (answer){
            return index;
        }
    });
    console.log(indeces)
    return (
        <div className={classes["main-navigation"]}>
            <h4 className={classes.title}>Навигация по тесту</h4>
            <div className={classes.grid}>
                {questions.map((question,index) => {
                    const answered = indeces.includes(index);
                    if (mode==="review"){
                        return (
                            <div key={question.id} className={classes["question-box"]} 
                                style={{
                                    backgroundColor: userAnswers[index].is_correct ? "green" : "red",
                                    color: 'white'
                                }}
                                onClick={()=>navigateToQuestionInReview(`question${index}`)}
                            >
                                {question.order}
                            </div>
                        )
                    }
                    return (
                        <div key={question.id} className={classes["question-box"]} 
                            style={{
                                backgroundColor: answered ? "gray" : "",
                                color: answered ? "white" : "",
                                border: activeQuestionIndex==index ? "2px solid gray" : ""
                            }}
                            onClick={()=>navigateToQuestion(index)}
                        >
                            {question.order}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MainNavigation