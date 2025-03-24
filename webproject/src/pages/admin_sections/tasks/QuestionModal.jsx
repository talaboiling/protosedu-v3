import React, { useEffect, useState } from 'react'
import Loader from '../../Loader';
import CloseIcon from "@mui/icons-material/Close";
import ToolsBar from './ToolsBar';
import Canvas from './Canvas';
import TaskInterface from './TaskInterface';

const QuestionModal = ({
    showQuestionModal,
    setShowQuestionModal,
    setCurrentQuestion,
    loading,
    editingQuestionIndex,
    currentQuestion,
    handleSelectCorrectAnswer,
    handleQuestionSubmit,
    handleImageUpload,
}) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  function handleCorrectAnswer(answer){
    setCurrentQuestion(prev=>({...prev, correct_answer: answer}));
  }

  console.log(currentQuestion);
  
  return (
    <dialog
          open={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          className="modal supermodal"
        >
          {loading ? (<Loader />) : (
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0"
              }}
              onClick={() => setShowQuestionModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {editingQuestionIndex !== null
                ? "Редактировать вопрос"
                : "Добавить вопрос"}
            </h2>
            <div className="taskConstructor" style={{height: "100%"}}>
              <TaskInterface setContent={setContent} currentQuestion={currentQuestion} 
                setCurrentQuestion={setCurrentQuestion}
                handleSelectCorrectAnswer={handleSelectCorrectAnswer} handleCorrectAnswer={handleCorrectAnswer}
                content={content}
              />

              <div className="taskDetails" style={{width: "80%"}}>
                <form onSubmit={(e)=> handleQuestionSubmit(e, content)}>
                  <div className="formConstructor">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "40px",
                        width: "80%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "60%",
                        }}
                      >
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Выберите тип задачи
                        </h3>

                        <select
                          list="questiontype"
                          id="questionType"
                          placeholder="Выбор правильного ответа"
                          style={{ margin: "0" }}
                          value={currentQuestion.question_type} // Add this line
                          onChange={(e) => {
                            setCurrentQuestion({
                              ...currentQuestion,
                              question_type: e.target.value,
                            });
                          }}
                          required
                        >
                          <option value="">Выберите тип задачи</option>
                          <option value="multiple_choice_text">
                            Выбор правильного ответа
                          </option>
                          <option value="multiple_choice_images">
                            Выбор правильного рисунка
                          </option>
                          <option value="drag_and_drop_text">
                            Драг н дроп текст
                          </option>
                          <option value="drag_and_drop_images">
                            Драг н дроп рисунки
                          </option>
                          <option value="click_image">
                            Нажатие по картинке
                          </option>
                          <option value="input_text">
                            Ввести значение
                          </option>
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBottom: "40px",
                      }}
                    >
                      <h3 className="defaultStyle" style={{ color: "#666" }}>
                        Выберите шаблон
                      </h3>
                      <ul
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "2rem",
                          margin: "0",
                        }}
                      >
                        <li
                          className={`bgitem template-1 ${
                            currentQuestion.template === "1"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              template: "1",
                            })
                          }
                        >
                          1
                        </li>
                        <li
                          className={`bgitem template-2 ${
                            currentQuestion.template === "2"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              template: "2",
                            })
                          }
                        >
                          2
                        </li>
                        <li
                          className={`bgitem template-3 ${
                            currentQuestion.template === "3"
                              ? " selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              template: "3",
                            })
                          }
                        >
                          3
                        </li>
                        <li
                          className={`bgitem template-4 ${
                            currentQuestion.template === "4"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              template: "4",
                            })
                          }
                        >
                          4
                        </li>
                      </ul>
                    </div>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "2rem",
                        marginBottom: "40px",
                      }}
                    >
                      <span>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Название вопроса
                        </h3>
                        <input
                          type="text"
                          id="questionTitle"
                          placeholder="Задание по арифметике"
                          value={currentQuestion.title}
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </span>

                      <span>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Описание вопроса
                        </h3>
                        <input
                          id="questionText"
                          value={currentQuestion.question_text}
                          placeholder="Ваш вопрос"
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              question_text: e.target.value,
                            })
                          }
                          required
                        />
                      </span>
                      <span>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Загрузить аудио файл
                        </h3>
                        {currentQuestion.audio && (
                          <audio controls>
                            <source
                              src={currentQuestion.audio}
                              type="audio/mp3"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            setCurrentQuestion({
                              ...currentQuestion,
                              audio: e.target.files[0],
                            });
                          }}
                        />
                      </span>
                    </span>

                    {currentQuestion.question_type ===
                      "multiple_choice_text" && (
                      <>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Варианты ответа (нажмите на правильный)
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <input
                              key={index + 1}
                              type="text"
                              placeholder={`Вариант ${index + 1}`}
                              value={
                                typeof option === "string"
                                  ? option
                                  : option.value
                              }
                              onChange={(e) => {
                                const updatedOptions = [
                                  ...currentQuestion.options,
                                ];
                                updatedOptions[index] = e.target.value;
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  options: updatedOptions,
                                });
                              }}
                              style={{ margin: "0" }}
                              className={
                                currentQuestion.correct_answer === index + 1
                                  ? "correct-answer"
                                  : ""
                              }
                              onClick={() => handleSelectCorrectAnswer(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {currentQuestion.question_type ===
                      "multiple_choice_images" && (
                      <>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Варианты ответа (нажмите на правильный)
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.options.map((image, index) => (
                            <div
                              className="optionsImgUpload"
                              key={index}
                              style={{
                                border:
                                  index === currentQuestion.correct_answer - 1
                                    ? "2px solid green"
                                    : "none",
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                className="optionImgUpload"
                                onChange={(e) => handleImageUpload(e, index)}
                              />
                              {image && (
                                <img
                                  src={
                                    typeof image === "string"
                                      ? image
                                      : URL.createObjectURL(image)
                                  }
                                  alt={`Option ${index + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    border:
                                      index ===
                                      currentQuestion.correct_answer - 1
                                        ? "2px solid green"
                                        : "none",
                                  }}
                                />
                              )}
                              <input
                                type="radio"
                                name="correctAnswer"
                                style={{ scale: "1.5" }}
                                checked={
                                  index === currentQuestion.correct_answer - 1
                                }
                                onChange={() =>
                                  handleSelectCorrectAnswer(index)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {currentQuestion.question_type === "drag_and_drop_text" && (
                      <>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Варианты ответа (введите порядок правильных ответов)
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <div className="optionsImgUpload" key={index}>
                              <input
                                type="text"
                                placeholder={`Вариант ${index + 1}`}
                                value={
                                  typeof option === "string"
                                    ? option
                                    : option.value
                                }
                                onChange={(e) => {
                                  const updatedOptions = [
                                    ...currentQuestion.options,
                                  ];
                                  updatedOptions[index] = e.target.value;
                                  setCurrentQuestion({
                                    ...currentQuestion,
                                    options: updatedOptions,
                                  });
                                }}
                                style={{ margin: "0" }}
                              />
                              <input
                                type="number"
                                placeholder={`Порядок`}
                                min="1"
                                max={currentQuestion.options.length}
                                value={currentQuestion.drag_answers[index]}
                                onChange={(e) => {
                                  const orderValue = e.target.value
                                    ? parseInt(e.target.value, 10)
                                    : "";
                                  const updatedDragAnswers = [
                                    ...currentQuestion.drag_answers,
                                  ];
                                  updatedDragAnswers[index] = orderValue;
                                  setCurrentQuestion({
                                    ...currentQuestion,
                                    drag_answers: updatedDragAnswers,
                                  });
                                }}
                                style={{ width: "100px", marginTop: "5px" }}
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <h3 className="defaultStyle" style={{ color: "#666" }}>
                            Правильный ответ
                          </h3>
                          <input
                                type="text"
                                placeholder={`Ответ`}
                                value={currentQuestion.correct_answer.answer}
                                onChange={(e) => {
                                  const answer = e.target.value
                                  setCurrentQuestion({
                                    ...currentQuestion,
                                    correct_answer: {answer: answer},
                                  });
                                }}
                                style={{ width: "100px", marginTop: "5px" }}
                              />
                        </div>
                      </>
                    )}

                    {currentQuestion.question_type ===
                      "drag_and_drop_images" && (
                      <>
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Варианты ответа (введите порядок правильных ответов)
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.images.map((image, index) => (
                            <div className="optionsImgUpload" key={index}>
                              <input
                                type="file"
                                accept="image/*"
                                className="optionImgUpload"
                                onChange={(e) => handleImageUpload(e, index)}
                              />
                              {image && (
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Option ${index + 1}`}
                                  style={{ width: "100px", height: "100px" }}
                                />
                              )}
                              <input
                                type="number"
                                placeholder={`Порядок`}
                                min="1"
                                max={currentQuestion.images.length}
                                value={currentQuestion.drag_answers[index]}
                                onChange={(e) => {
                                  const orderValue = e.target.value
                                    ? parseInt(e.target.value, 10)
                                    : "";
                                  const updatedDragAnswers = [
                                    ...currentQuestion.drag_answers,
                                  ];
                                  updatedDragAnswers[index] = orderValue;
                                  setCurrentQuestion({
                                    ...currentQuestion,
                                    drag_answers: updatedDragAnswers,
                                  });
                                }}
                                style={{ width: "100px", marginTop: "5px" }}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="superBtn"
                    style={{ marginTop: "30px" }}
                  >
                    {editingQuestionIndex !== null ? "Сохранить" : "Добавить"}
                  </button>
                </form>
              </div>
            </div>

          </div>
          )}
        </dialog>
  )
}

export default QuestionModal