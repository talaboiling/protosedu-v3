import React, { useState } from "react";
import styles from "./QuestionsCreator.module.css";
import { X } from "lucide-react";

const QuestionsCreator = ({questions, setQuestions}) => {
  console.log(questions);
  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    if (field=="contents"){
      newQuestions[qIndex][field] = [{
        content_type: "image",
        image: value
      }]
    }else{
      newQuestions[qIndex][field] = value;
    }
    setQuestions(newQuestions);
  };


  const handleAnswerChange = (qIndex, aIndex, value, type="text") => {
    const newQuestions = [...questions];
    if (type==="text"){
      newQuestions[qIndex].answer_options[aIndex].text = value;
    }else{
      newQuestions[qIndex].answer_options[aIndex].image = value;
    }
    setQuestions(newQuestions);
  };

  const handleQuestionAnswerTypeChange=(qIndex, aIndex, field, value)=>{
    const newQuestions = [...questions];
    if (field==="option_type"){
      newQuestions[qIndex].answer_options[aIndex]["text"] = "";
      newQuestions[qIndex].answer_options[aIndex]["image"] = "";
    }
    newQuestions[qIndex].answer_options[aIndex][field] = value;
    setQuestions(newQuestions);
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        image: "",
        answer_options: [
          {text:"", option_type:"text", is_correct: false}, 
          {text:"", option_type:"text", is_correct: false}, 
          {text:"", option_type:"text", is_correct: false},
          {text:"", option_type:"text", is_correct: false}
        ],
        order:questions.length+1
      }  ,
    ]);
  };

  const handleImageChange = (qIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      handleQuestionChange(qIndex, "contents", file);
    }
  };

  const handleAnswerImageChange = (qIndex, aIndex, event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (file) {
      handleAnswerChange(qIndex, aIndex, file, "image");
    }
  };

  const handleAnswerCorrect = (qIndex, aIndex)=>{
    const newQuestions = [...questions];
    newQuestions[qIndex].answer_options=newQuestions[qIndex].answer_options.map(answer=>({...answer, is_correct: false}));
    newQuestions[qIndex].answer_options[aIndex].is_correct = true;
    setQuestions(newQuestions);
  };

  console.log(questions);

  const removeQuestion = (index) => {
    const filteredQuestions = questions.filter((_, qIndex)=>qIndex!==index);
    setQuestions([...filteredQuestions]);
  };

  return (
    <div className={styles.questionsList}>
      {questions.map((question, qIndex) => (
        <div key={question.order} className={styles.questionItem}>
          <p>Question {qIndex+1}</p>
          <div
            style={{
              position: "absolute", 
              right: "20px", 
              top: "20px", 
              cursor: "pointer"
            }}
            onClick={()=>removeQuestion(qIndex)}
          >
            <X size={28} color="red"/>
          </div>
          <textarea
            placeholder="Question title"
            value={question.title}
            onChange={(e) =>
              handleQuestionChange(qIndex, "title", e.target.value)
            }
            style={{height: "200px", overflow:"auto", border: "1px solid black", padding: "1rem", fieldSizing: "normal"}}
            contentEditable={true}
            className={styles.questionHeading}
            required
          />

          <div style={{ margin: "0.5rem 0" }}>
            <label>Upload question image: </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(qIndex, e)}
            />
            {question.contents && question.contents.map(content=>
              (
                <img
                  src={content.image}
                  alt="question preview"
                  className={styles.questionImage}
                />
              )
            )}
          </div>


          <div className={styles.answers}>
            {question.answer_options.map((answer_option, aIndex) => (
              <div key={aIndex} className={styles.answer} onClick={()=>handleAnswerCorrect(qIndex, aIndex)} style={{backgroundColor: questions[qIndex].answer_options[aIndex].is_correct ? "green" : ""}}>
                <div style={{ margin: "0.5rem 0" }}>
                  <select
                    value={answer_option.option_type}
                    onClick={e=>e.stopPropagation()}
                    onChange={(e) =>
                      handleQuestionAnswerTypeChange(qIndex, aIndex, "option_type", e.target.value)
                    }
                    required
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                {answer_option.option_type === "text" ? (
                  <input
                    type="text"
                    placeholder={`Answer ${aIndex + 1}`}
                    value={answer_option.text}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    className={styles.answerInput}
                    required
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
                      required
                    />
                    {answer_option.image && (
                      <img
                        src={answer_option.image}
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