import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DraggableItem from './DraggableItem';
import DroppablePlaceholder from './DroppablePlaceholder';
import CustomDragLayer from './CustomDragLayer';
import staricon from "../../assets/navStars.webp";
import cupicon from "../../assets/navCups.webp";

import audioOn from "../../assets/taskaudio_new.svg";
import audioOff from "../../assets/notaskaudio.svg";
import bgmusicOn from "../../assets/bgmusic_new.svg";
import bgmusicOff from "../../assets/nobgmusic.svg";
import CloseIcon from '@mui/icons-material/Close';
import { fabric } from "fabric";
import classes from "./TaskModal.module.css"
import DnDquestion from "./DragAndDrop/DnDquestion";
import QuestionStudent from "./QuestionStudent";
import click_audio from "../../assets/audio/click_sound.mp3";
import { createComplaint } from "../../utils/apiService";
import { ToastContainer, toast } from 'react-toastify';


const TaskModal = ({
  user,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  feedbackMessage,
  toggleAudio,
  isAudioPlaying,
  isMuted,
  toggleMute,
  volume,
  handleVolumeChange,
  droppedOrder,
  handleSubmit,
  handleNextQuestion,
  closeTaskModal,
  t,
  isButtonDisabled,
  audioRef,
  setIsAudioPlaying,
  showFeedback,
  handleIncorrect
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const [selectedOption, setSelectedOption] = useState(null);
  const [foundError, setFoundError] = useState(false);
  const [complaintFormData, setComplaintFormData] = useState({
    question: null,
    type: "content",
    description: "",
  });

  const clickSoundRef = useRef();

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    if (clickSoundRef.current) {
      clickSoundRef.current.play();
    }
    if (optionId == currentQuestion.correct_answer) {
      handleSubmit();
    } else {
      handleIncorrect();
    }
  };


  return (
    <>

      {currentQuestion && <dialog className="studmodal" open style={{ display: "flex", justifyContent: "center" }}>
        <div className="studmodal-content">
          <div className="modalHeader" style={{ position: "relative" }}>
            <span style={{ display: "flex", flexDirection: "row", gap: "2rem", alignItems: "center" }}>
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
              <button
                className="transBtn"
                onClick={toggleMute}
                style={{ color: "gray" }}
              >
                {isMuted ? (
                  <div className="bgmusicOff" >
                    <img src={bgmusicOff} alt="music off" style={{ width: "40px", height: "40px" }} />
                  </div>
                ) : (
                  <div className="bgmusicOn">
                    <img src={bgmusicOn} alt="music on" style={{ width: "40px", height: "40px" }} />
                  </div>
                )}
              </button>
              {currentQuestion.audio && (
                <>
                  <div className="taskmodalaudio">
                    <button className="transBtn" onClick={toggleAudio}>
                      {isAudioPlaying ? (
                        <div className="audioOn">
                          <img src={audioOn} alt="audio on" style={{ width: "40px", height: "40px" }} />
                        </div>
                      ) : (
                        <div className="audioOff">
                          <img src={audioOff} alt="audio off" style={{ width: "40px", height: "40px" }} />
                        </div>
                      )}
                    </button>
                  </div>
                  <audio
                    ref={audioRef}
                    src={currentQuestion.audio}
                    onEnded={() => setIsAudioPlaying(false)}
                  />
                </>
              )}
            </span>

            <button
              className="modalCloseBtn"
              onClick={closeTaskModal}
            >
              {t("close")}
            </button>
            <button
              className="transBtn modalCloseBtnMob"
              onClick={closeTaskModal}
            >
              <CloseIcon></CloseIcon>
            </button>
          </div>
          <QuestionStudent
            currentQuestion={currentQuestion}
            showFeedback={showFeedback}
            handleSubmit={handleSubmit}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handleOptionClick={handleOptionClick}
            feedbackMessage={feedbackMessage}
            handleIncorrect={handleIncorrect}
            currentQuestionIndex={currentQuestionIndex}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
          />
          {foundError && (
            <dialog
              open
              onClick={() => setFoundError(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  maxWidth: "400px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3 style={{ margin: 0, color: "black" }}>{t("pleaseDescribeProblem")}</h3>
                <textarea
                  placeholder={t("typeHere")}
                  value={complaintFormData.description}
                  onChange={(e) =>
                    setComplaintFormData({ ...complaintFormData, description: e.target.value })
                  }
                  rows={4}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "none",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button onClick={() => setFoundError(false)}>{t("cancel")}</button>
                  <button
                    className="orangeButton"
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append("question", complaintFormData.question);
                      formData.append("description", complaintFormData.description);
                      formData.append("type", complaintFormData.type);
                      formData.append("user", complaintFormData.user);

                      try {
                        await createComplaint(formData);
                        toast.success(t("complaintSent"))
                        setFoundError(false);
                      } catch (err) {
                        toast.error(t("errorSendingComplaint"))
                        console.error(err);
                      }
                    }}
                  >
                    {t("send")}
                  </button>
                </div>
              </div>
            </dialog>
          )}
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
              <button onClick={() => {
                setFoundError(true)
                console.log("foundError:", foundError)
                const userJson = JSON.parse(localStorage.getItem("user"));
                setComplaintFormData({
                  user: userJson.id,
                  description: "",
                  question: currentQuestion.id,
                  type: "content",
                })
              }}>{t("foundProblem")}</button>
              <button
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? handleSubmit
                    : handleNextQuestion
                }
                disabled={
                  (selectedOption === null && droppedOrder.length === 0) ||
                  isButtonDisabled
                }
                className={`${currentQuestionIndex === questions.length - 1
                  ? ""
                  : "orangeButton"
                  }`}
                style={{ float: "right" }}
              >
                {currentQuestionIndex === questions.length - 1
                  ? t("finish")
                  : t("next")}
              </button>
            </span>
          </div>
        </div>
        <audio ref={clickSoundRef} src={click_audio}></audio>
      </dialog>}

      <ToastContainer />

    </>
  );
};

export default TaskModal;
