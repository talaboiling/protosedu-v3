import React, { useEffect, useState } from 'react'
import Question from './Question'
import classes from "./Quiz.module.css";
import { useParams } from 'react-router-dom';
import { getTestReview } from '../../../utils/apiService';

const QuizReview = ({questionData, questions, userAnswers}) => {
    console.log(questions, userAnswers);
    const {testId} = useParams();

    const [data, setData] = useState(null);
    useEffect(()=>{
      async function getReview(){
        try {
          const data = await getTestReview(testId);
          setData(data)
        }catch(e){

        }
      }
      getReview();
    },[]);
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