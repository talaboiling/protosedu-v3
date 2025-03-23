import React, { useState } from "react";
import styles from "./QuestionsCreator.module.css";

const QuestionsCreator = ({questions, setQuestions}) => {

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    console.log(qIndex, field, value);
    if (field==="answerType"){
      if (value==="image"){
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.map(answer=>({image:"", answerType:"image", is_correct: false}));
      }else{
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.map(answer=>({text:"", answerType:"text", is_correct: false}));
      }
    }
    setQuestions(newQuestions);
  };


  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].text = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        image: "",
        answerType: "text", // can be "text" or "image"
        answers: [
          {text:"", answerType:"text", is_correct: false}, 
          {text:"", answerType:"text", is_correct: false}, 
          {text:"", answerType:"text", is_correct: false},
          {text:"", answerType:"text", is_correct: false}
        ],
        order:questions.length+1
      }  ,
    ]);
  };

  const handleImageChange = (qIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleQuestionChange(qIndex, "image", imageUrl);
    }
  };

  const handleAnswerImageChange = (qIndex, aIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleAnswerChange(qIndex, aIndex, imageUrl);
    }
  };

  const handleAnswerCorrect = (qIndex, aIndex)=>{
    const newQuestions = [...questions];
    newQuestions[qIndex].answers=newQuestions[qIndex].answers.map(answer=>({...answer, is_correct: false}));
    newQuestions[qIndex].answers[aIndex].is_correct = true;
    setQuestions(newQuestions);
  }

  console.log(questions);

  return (
    <div className={styles.questionsList}>
      {questions.map((question, qIndex) => (
        <div key={question.order} className={styles.questionItem}>
          <p>Question {qIndex+1}</p>
          <input
            type="text"
            placeholder="Question title"
            value={question.heading}
            onChange={(e) =>
              handleQuestionChange(qIndex, "title", e.target.value)
            }
            className={styles.questionHeading}
          />

          <div style={{ margin: "0.5rem 0" }}>
            <label>Upload question image: </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(qIndex, e)}
            />
            {question.image && (
              <img
                src={question.image}
                alt="question preview"
                className={styles.questionImage}
              />
            )}
          </div>

          <div style={{ margin: "0.5rem 0" }}>
            <label>Answer Type: </label>
            <select
              value={question.answerType}
              onChange={(e) =>
                handleQuestionChange(qIndex, "answerType", e.target.value)
              }
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className={styles.answers}>
            {[0, 1, 2, 3].map((aIndex) => (
              <div key={aIndex} className={styles.answer} onClick={()=>handleAnswerCorrect(qIndex, aIndex)} style={{backgroundColor: questions[qIndex].answers[aIndex].is_correct ? "green" : ""}}>
                {question.answerType === "text" ? (
                  <input
                    type="text"
                    placeholder={`Answer ${aIndex + 1}`}
                    value={question.answers[aIndex].text}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    className={styles.answerInput}
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleAnswerImageChange(qIndex, aIndex, e)
                      }
                      className={styles.answerImageInput}
                    />
                    {question.answers[aIndex].image && (
                      <img
                        src={question.answers[aIndex].image}
                        alt={`Answer ${aIndex + 1}`}
                        className={styles.answerPreview}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{display: "flex", gap:"1rem"}}>
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        {/* <button type="button" onClick={addContent}>
          Add Content
        </button> */}
      </div>
    </div>
  );
};

export default QuestionsCreator;