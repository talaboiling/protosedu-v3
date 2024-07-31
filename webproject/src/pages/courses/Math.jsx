import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import bgmusic from "../../assets/audio/Kevin MacLeod_ Atlantean Twilight.mp3";
import click_audio from "../../assets/audio/click_sound.mp3";
import correct_audio from "../../assets/audio/correct_sound.mp3";
import incorrect_audio from "../../assets/audio/incorrect_sound.mp3";
import { useTranslation } from "react-i18next";
import Loader from "../Loader";
import {
  fetchUserData,
  fetchCourse,
  fetchSections,
  fetchTask,
  fetchQuestions,
  answerQuestion,
} from "../../utils/apiService";
import CourseCard from "./CourseCard";
import SectionContent from "./SectionContent";
import VideoModal from "./VideoModal";
import TaskModal from "./TaskModal";
import SubscriptionErrorModal from "./SubscriptionErrorModal";

const Math = () => {
  const { t } = useTranslation();
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
  const [droppedOrder, setDroppedOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const backgroundAudioRef = useRef(null);
  const clickSoundRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const [isBackgroundAudioPlaying, setIsBackgroundAudioPlaying] =
    useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const [isProgramSwitched, setIsProgramSwitched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
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
      setSections(sectionsData);
      setCourse(courseData);
      setUser(userData);
      setHasSubscription(userData.has_subscription);
      setIsFreeTrial(userData.is_free_trial);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (url) => {
    if (!isFreeTrial && !hasSubscription) {
      setShowSubscriptionError(true);
      return;
    }
    const embedUrl = url.replace("watch?v=", "embed/");
    setVideoUrl(embedUrl);
    setShowVideoModal(true);
  };

  const openTaskModal = async (sectionId, taskId) => {
    if (!isFreeTrial && !hasSubscription) {
      setShowSubscriptionError(true);
      return;
    }
    try {
      const task = await fetchTask(courseId, sectionId, taskId, childId);
      const taskQuestions = await fetchQuestions(
          courseId,
          task.section,
          taskId,
          childId
      );
      if (taskQuestions.length === 0) {
        alert(t("noQuestions"));
        return;
      }
      setTaskContent(task);
      setQuestions(taskQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setDroppedOrder(
        new Array(taskQuestions[0].correct_answer.length).fill(null)
      ); // Initialize droppedOrder with the correct length
      setShowTaskModal(true);


      // Play background music
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.play();
        setIsBackgroundAudioPlaying(true);
      }
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


    // Stop background music
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
      setIsBackgroundAudioPlaying(false);
    }
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    if (clickSoundRef.current) {
      clickSoundRef.current.play();
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedOrder = Array.from(droppedOrder);
    const [movedItem] = updatedOrder.splice(result.source.index, 1);
    updatedOrder.splice(result.destination.index, 0, movedItem);
    setDroppedOrder(updatedOrder);
  };

  const handleNextQuestion = async () => {
    setIsButtonDisabled(true);
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

    if (isCorrect && correctSoundRef.current) {
      correctSoundRef.current.play();
    } else if (!isCorrect && incorrectSoundRef.current) {
      incorrectSoundRef.current.play();
    }

    try {
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
        setDroppedOrder(
          new Array(
            questions[currentQuestionIndex + 1]?.correct_answer.length
          ).fill(null)
        );
        setIsButtonDisabled(false);
      }, 1500);
    } catch (error) {
      console.error("Error answering question:", error);
      alert(
        "An error occurred while submitting your answer. Please try again."
      );
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async () => {
    setIsButtonDisabled(true);
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

    if (isCorrect && correctSoundRef.current) {
      correctSoundRef.current.play();
    } else if (!isCorrect && incorrectSoundRef.current) {
      incorrectSoundRef.current.play();
    }

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
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
          backgroundAudioRef.current.currentTime = 0;
          setIsBackgroundAudioPlaying(false);
        }
        setIsButtonDisabled(false);
      }, 1500);

      await loadData();
    } catch (error) {
      console.error("Error answering question:", error);
      alert(
        "An error occurred while submitting your answer. Please try again."
      );
      setIsButtonDisabled(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsAudioPlaying(false);
    };
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);

  const toggleMute = () => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };


  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rtdash rtrat mathLesson">
      <Sidebar className="courseSidebar" isMenuOpen={isMenuOpen} />
      <div className="centralLessons">
        <div className="centralLessonsInner maths">
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isProgramSwitched={isProgramSwitched}
            setIsProgramSwitched={setIsProgramSwitched}
            urlPath={"lesson"}
          />
        </div>
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              <CourseCard course={course} t={t} />
            </div>
            <div className="lessonsCont">
              <h2
                className="defaultStyle title"
                style={{ color: "black", fontWeight: "700" }}
              >
                {" "}
                {t ('courseStart')}{" "}
              </h2>

              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="contWrapper">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <hr className="lessonsHr" />
                    <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                      {section.title}
                    </h2>
                    <hr className="lessonsHr"/>
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
                              <strong>{t ('youCompletedTask')}</strong>
                            </div>
                          )}
                          {!content.is_completed && (
                            <div className="completedTask incompleteTask">
                              <strong>{t ('youHaveNewTask')}</strong>
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
          <div className={`lessonsProg ${isProgramSwitched ? "activeProgram" : ""}`}>
            <h3
              className="defaultStyle"
              style={{ color: "black", fontWeight: "800", fontSize: "x-large" }}
            >
              {t ('whatWeLearn')}
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
            <SectionContent
              sections={sections}
              openVideoModal={openVideoModal}
              openTaskModal={openTaskModal}
              hasSubscription={hasSubscription}
              t={t}
            />
          </div>
        </div>
      </div>

      {showVideoModal && (
        <VideoModal
          videoUrl={videoUrl}
          closeVideoModal={closeVideoModal}
          t={t}
        />
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
                {t ('close')}
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
                  <div className="feedbackContent">
                    <img src={feedbackMessage === "Correct!" ? correctlion : wronglion} alt="lion mascot" />
                    <p
                      style={{
                        color: "black",
                        fontSize: "xx-large",
                        fontWeight: "700",
                        textAlign: "center",
                        backgroundColor:"white",
                        padding:"10px",
                        borderRadius:"10px",
                      }}
                    >
                      {feedbackMessage === "Correct!"
                      ? t ('correct')
                      : t ('incorrect')}
                    </p>
                  </div>
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
                        <span 
                          className=
                            {`questionTitle ${
                              currentQuestion?.template 
                                ? `qt-template-${currentQuestion.template}` 
                                : ""
                              }`}>
                          <strong>{currentQuestionIndex + 1}. </strong>
                          <i>{currentQuestion.title}:</i>{" "} <br />
                          <strong>{currentQuestion.question_text}</strong>
                        </span>
                        {currentQuestion.is_attempted && (
                          <strong style={{ color: "green", marginTop: "50px" }}>
                            {t ('alreadyAnswered')}
                          </strong>
                        )}
                        {currentQuestion.audio && (
                          <>
                            <div className="taskmodalaudio">
                              <button className="" onClick={toggleAudio}>
                                {isAudioPlaying ? <PauseIcon sx={{ fontSize: 50 }} /> : <PlayArrowIcon sx={{ fontSize: 50 }} />}
                              </button>
                            </div>
                            
                            <audio ref={audioRef} src={currentQuestion.audio} />
                          </>
                        )}
                        <div style={{
                              float: "right",
                              position:"absolute",
                              right:"0",
                              display:"flex",
                              flexDirection:"column",
                            }} className="audioContainer">
                          <button
                            className="transBtn"
                            onClick={toggleMute}
                            style={{color:"gray"}}
                          >
                            {isMuted ? <VolumeOffIcon sx={{fontSize:"70px"}}/> : <VolumeUpIcon sx={{fontSize:"70px"}}/>}
                          </button>
                          <input
                            type="range"
                            id="volumeControl"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                          />
                        </div>
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
                        <ul className={currentQuestion.question_type === "multiple_choice_text" ?
                          "studTaskOptions" : "studTaskImgs"
                        }>
                          {currentQuestion.options.map((option, idx) => (
                            <li
                              key={idx}
                              className={currentQuestion.question_type === "multiple_choice_text" ? (
                                `studTaskOption ${
                                selectedOption === option.id
                                  ? "studTaskOptionSelected"
                                  : ""
                              }`
                              ) : (
                                `studTaskImg ${
                                selectedOption === option.id
                                  ? "studTaskImgSelected"
                                  : ""
                                }`
                              )}
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
                    (selectedOption === null && droppedOrder.length === 0) || isButtonDisabled
                  }
                  className={`${
                    currentQuestionIndex === questions.length - 1
                      ? ""
                      : "orangeButton"
                  }`}
                  style={{ float: "right" }}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? t ('finish')
                    : t ('next')}
                </button>
              </span>
            </div>
          </div>
        </dialog>
      )}
      <audio ref={backgroundAudioRef} src={bgmusic} loop/>
        <TaskModal
          user={user}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          feedbackMessage={feedbackMessage}
          showFeedback={showFeedback}
          toggleAudio={toggleAudio}
          isAudioPlaying={isAudioPlaying}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          handleOptionClick={handleOptionClick}
          handleDragEnd={handleDragEnd}
          droppedOrder={droppedOrder}
          handleSubmit={handleSubmit}
          handleNextQuestion={handleNextQuestion}
          closeTaskModal={closeTaskModal}
          t={t}
          isButtonDisabled={isButtonDisabled}
        />
      )}

      {showSubscriptionError && (
        <SubscriptionErrorModal
          setShowSubscriptionError={setShowSubscriptionError}
          t={t}
        />
      )}

      <audio ref={backgroundAudioRef} src={bgmusic} loop />
      <audio ref={clickSoundRef} src={click_audio}></audio>
      <audio ref={correctSoundRef} src={correct_audio}></audio>
      <audio ref={incorrectSoundRef} src={incorrect_audio}></audio>
    </div>
  );
};

export default Math;
