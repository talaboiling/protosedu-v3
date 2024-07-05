import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import staricon from "../../assets/navStars.png";
import cupicon from "../../assets/navCups.png";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  fetchUserData,
  fetchCourse,
  fetchSections,
  fetchTask,
  fetchQuestions,
  answerQuestion,
} from "../../utils/apiService";
import Loader from "../Loader";

const Math = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [taskContent, setTaskContent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isChild, setIsChild] = useState(false);
  const [childId, setChildId] = useState("");
  const [draggedOption, setDraggedOption] = useState(null);
  const [droppedOrder, setDroppedOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const child_id = localStorage.getItem("child_id");
      let userData;
      if (child_id) {
        userData = await fetchUserData(child_id);
        setIsChild(true);
        setChildId(child_id);
      } else {
        userData = await fetchUserData();
      }
      const courseData = await fetchCourse(courseId, child_id);
      const sectionsData = await fetchSections(courseId, child_id);
      console.log(sectionsData);
      setSections(sectionsData);
      setCourse(courseData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (url) => {
    const embedUrl = url.replace("watch?v=", "embed/");
    setVideoUrl(embedUrl);
    setShowVideoModal(true);
  };

  const openTaskModal = async (sectionId, taskId) => {
    try {
      const task = await fetchTask(courseId, sectionId, taskId, childId);
      const taskQuestions = await fetchQuestions(
        courseId,
        task.section,
        taskId,
        childId
      );
      if (taskQuestions.length === 0) {
        alert("This task has no questions.");
        return;
      }
      setTaskContent(task);
      setQuestions(taskQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setDroppedOrder([]);
      setShowTaskModal(true);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeTaskModal = async () => {
    setShowTaskModal(false);
    await loadData();
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleDragStart = (optionId) => {
    setDraggedOption(optionId);
  };

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const updatedOrder = [...droppedOrder];
    updatedOrder[dropIndex] = draggedOption;
    setDroppedOrder(updatedOrder);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect;

    if (currentQuestion.question_type.startsWith("drag_and_drop")) {
      isCorrect =
        JSON.stringify(droppedOrder) ===
        JSON.stringify(currentQuestion.correct_answer);
    } else {
      isCorrect = selectedOption === currentQuestion.correct_answer;
    }

    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);

    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      currentQuestion.id,
      selectedOption,
      childId
    );

    setTimeout(() => {
      setShowFeedback(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setDroppedOrder([]);
    }, 1500);
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect;

    if (currentQuestion.question_type.startsWith("drag_and_drop")) {
      isCorrect =
        JSON.stringify(droppedOrder) ===
        JSON.stringify(currentQuestion.correct_answer);
    } else {
      isCorrect = selectedOption === currentQuestion.correct_answer;
    }

    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);

    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      currentQuestion.id,
      selectedOption,
      childId
    );

    setTimeout(async () => {
      setShowFeedback(false);
      setShowTaskModal(false);
    }, 1500);

    await loadData();
  };

  if (loading) {
    return <Loader></Loader>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="rtdash rtrat">
      <Sidebar className="courseSidebar" />
      <div className="centralLessons">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
        />
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed} />
                  <p className="defaultStyle">
                    Выполнено {course.completed_tasks} из {course.total_tasks}{" "}
                    заданий
                  </p>
                </div>
                <img
                  src={course.name === "Математика" ? mathIcon : englishIcon}
                  alt={course.name}
                  style={{
                    backgroundColor: "#F8753D",
                    border: "1px solid black",
                    borderRadius: "21px",
                  }}
                />
              </div>
            </div>
            <div className="lessonsCont">
              <h2
                className="defaultStyle"
                style={{ color: "black", fontWeight: "700" }}
              >
                {" "}
                Начало курса{" "}
              </h2>

              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <hr />
                    <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                      {section.title}
                    </h2>
                    <hr />
                  </div>
                  {section.contents.map((content, contentIndex) => (
                    <div className="lessonsLinks" key={contentIndex}>
                      {content.content_type === "lesson" ? (
                        <div
                          className="vidBlock studVidBlock"
                          onClick={() => openVideoModal(content.video_url)}
                        >
                          <div className="thumbcontainer">
                            <img
                              src={bgvideo || "placeholder.png"}
                              alt="vidname"
                              className="taskThumbnail"
                            />
                          </div>
                          <p
                            style={{
                              backgroundColor: "white",
                              margin: "0",
                              padding: "7px 40px",
                              borderRadius: "10px",
                            }}
                          >
                            {content.title}
                          </p>
                        </div>
                      ) : (
                        <div
                          className="studVidBlock task"
                          onClick={() =>
                            openTaskModal(content.section, content.id)
                          }
                        >
                          <img
                            src={bgtask || "placeholder.png"}
                            alt="vidname"
                            className="taskThumbnail"
                          />

                          <p
                            style={{
                              backgroundColor: "white",
                              margin: "0",
                              padding: "7px 40px",
                              borderRadius: "10px",
                              marginBottom: "7px",
                            }}
                          >
                            {content.title}
                          </p>
                          {content.is_completed && (
                            <div className="completedTask">
                              <VerifiedIcon sx={{ color: "#19a5fc" }} />
                              <strong>Вы сделали это задание!</strong>
                            </div>
                          )}
                          {!content.is_completed && (
                            <div className="completedTask incompleteTask">
                              <strong>Вас ждет новое задание</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="lessonsProg">
            <h3
              className="defaultStyle"
              style={{ color: "black", fontWeight: "800", fontSize: "x-large" }}
            >
              Что мы будем проходить:
            </h3>
            <div className="progList">
              {sections.map((section, index) => (
                <div className="progItem" key={index}>
                  <p style={{ margin: "0", marginBottom: "15px" }}>
                    {section.title}
                  </p>
                  <progress
                    value={section.percentage_completed / 100}
                    max="1"
                  ></progress>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showVideoModal && (
        <dialog className="studmodal" open>
          <div className="studmodal-content">
            <div className="modalHeader" style={{ marginBottom: "20px" }}>
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Видеоурок
              </h2>
              <button
                style={{
                  float: "right",
                  backgroundColor: "lightgray",
                  border: "none",
                  borderRadius: "10px",
                  color: "#666",
                }}
                onClick={closeVideoModal}
              >
                Закрыть
              </button>
            </div>
            <iframe
              width="500px"
              height="315px"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </dialog>
      )}

      {showTaskModal && (
        <dialog className="studmodal" open>
          <div className="studmodal-content">
            <div className="modalHeader">
              <span
                style={{ display: "flex", flexDirection: "row", gap: "2rem" }}
              >
                <p
                  className="lndsh"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 20px",
                    gap: "0.5rem",
                  }}
                >
                  <img src={staricon} alt="" className="defaultIcon" />
                  {user.stars}
                </p>
                <p
                  className="lndsh"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 20px",
                    gap: "0.5rem",
                  }}
                >
                  <img src={cupicon} alt="" className="defaultIcon" />
                  {user.cups}
                </p>
              </span>

              <button
                style={{
                  float: "right",
                  backgroundColor: "lightgray",
                  border: "none",
                  borderRadius: "10px",
                  color: "#666",
                }}
                onClick={closeTaskModal}
              >
                Закрыть
              </button>
            </div>
            <div
              className={`studtaskDetails ${
                currentQuestion?.template
                  ? `template-${currentQuestion.template}`
                  : ""
              }`}
            >
              {showFeedback && (
                <div
                  className={`feedbackMessage ${
                    feedbackMessage === "Correct!"
                      ? "fbmcorrect"
                      : "fbmincorrect"
                  }`}
                >
                  <p
                    className={`defaultStyle ${
                      feedbackMessage === "Correct!"
                        ? "fbmcorrect"
                        : "fbmincorrect"
                    }`}
                  >
                    {feedbackMessage === "Correct!"
                      ? "Правильно!"
                      : "Неправильно!"}
                  </p>
                </div>
              )}
              <div className="questionCarousel">
                <div className="questionContent">
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: "x-large",
                      padding: "7px 0",
                      gap: "1rem",
                    }}
                  >
                    <li key={currentQuestionIndex}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: "0.33rem",
                          maxWidth: "500px",
                          textAlign: "center",
                        }}
                      >
                        <span>
                          <strong>{currentQuestionIndex + 1}. </strong>
                          <i>{currentQuestion.title}:</i>{" "}
                        </span>
                        <strong>{currentQuestion.question_text}</strong>
                        {currentQuestion.is_attempted && (
                          <strong style={{ color: "green", marginTop: "50px" }}>
                            Вы уже ответили на этот вопрос
                          </strong>
                        )}
                        {currentQuestion.audio && (
                          <audio controls>
                            <source
                              src={currentQuestion.audio}
                              type="audio/mp3"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </span>
                      {currentQuestion.question_type.startsWith(
                        "drag_and_drop"
                      ) ? (
                        <ul
                          className="studTaskOptions"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.options.map((option, idx) => (
                            <li
                              key={idx}
                              className="studTaskOption"
                              draggable
                              onDragStart={() => handleDragStart(option.id)}
                              onDrop={(event) => handleDrop(event, idx)}
                              onDragOver={allowDrop}
                              style={{ cursor: "move" }}
                            >
                              {currentQuestion.question_type ===
                              "drag_and_drop_images" ? (
                                <img
                                  src={option.value}
                                  alt={`option-${idx}`}
                                  style={{ width: "100px", height: "100px" }}
                                />
                              ) : (
                                option.value
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="studTaskOptions">
                          {currentQuestion.options.map((option, idx) => (
                            <li
                              key={idx}
                              className={`studTaskOption ${
                                selectedOption === option.id
                                  ? "studTaskOptionSelected"
                                  : ""
                              }`}
                              onClick={() => {
                                handleOptionClick(option.id);
                              }}
                            >
                              {currentQuestion.question_type ===
                              "multiple_choice_images" ? (
                                <img
                                  src={option.value}
                                  alt={`option-${idx}`}
                                  style={{ width: "100px", height: "100px" }}
                                />
                              ) : (
                                option.value
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="navigationButtons">
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <progress
                  value={progress - 100 / questions.length}
                  max="100"
                  style={{ width: "60%", marginTop: "10px" }}
                ></progress>
                <button
                  onClick={
                    currentQuestionIndex === questions.length - 1
                      ? handleSubmit
                      : handleNextQuestion
                  }
                  disabled={
                    selectedOption === null && droppedOrder.length === 0
                  }
                  className={`${
                    currentQuestionIndex === questions.length - 1
                      ? ""
                      : "orangeButton"
                  }`}
                  style={{ float: "right" }}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Закончить"
                    : "Дальше"}
                </button>
              </span>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Math;
