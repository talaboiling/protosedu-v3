import React from 'react'
import classes from "./Quiz.module.css";

const FooterNavigation = ({activeQuestionIndex, goNext, goBack, length, finishQuiz}) => {
    console.log(activeQuestionIndex, goNext, goBack, length);
    return (
        <div className={classes["footer"]}>
            {activeQuestionIndex>0 && <button onClick={goBack}>
                Go back
            </button>}
            {activeQuestionIndex<length-1 && <button onClick={goNext}>
                Go Forward
            </button>}
            {activeQuestionIndex==length-1 && <button onClick={finishQuiz}>
                Finish the quiz
            </button>}
        </div>
    )
}

export default FooterNavigation