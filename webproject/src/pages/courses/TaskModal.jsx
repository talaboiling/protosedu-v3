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
import {fabric} from "fabric";
import classes from "./TaskModal.module.css"
import DnDquestion from "./DragAndDrop/DnDquestion";
import QuestionStudent from "./QuestionStudent";
import click_audio from "../../assets/audio/click_sound.mp3";

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
  console.log(questions);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  console.log(currentQuestion);
  const [selectedOption, setSelectedOption] = useState(null);

  const clickSoundRef = useRef();

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    if (clickSoundRef.current) {
      clickSoundRef.current.play();
    }
    if (optionId==currentQuestion.correct_answer){
      handleSubmit();
    }else{
      handleIncorrect();
    }
  };


  return (
    <>
    {currentQuestion && <dialog className="studmodal" open style={{display:"flex", justifyContent:"center"}}>
      <div className="studmodal-content">
        <div className="modalHeader" style={{position: "relative"}}>
          <span style={{ display: "flex", flexDirection: "row", gap: "2rem", alignItems:"center" }}>
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
                  <img src={bgmusicOff} alt="music off" style={{width:"40px", height:"40px"}}/>
                </div>
              ) : (
                <div className="bgmusicOn">
                  <img src={bgmusicOn} alt="music on" style={{width:"40px", height:"40px"}}/>
                </div>
              )}
            </button>
            {currentQuestion.audio && (
              <>
                <div className="taskmodalaudio">
                  <button className="transBtn" onClick={toggleAudio}>
                    {isAudioPlaying ? (
                      <div className="audioOn">
                        <img src={audioOn} alt="audio on" style={{width:"40px", height:"40px"}}/>
                      </div>
                    ) : (
                      <div className="audioOff">
                        <img src={audioOff} alt="audio off" style={{width:"40px", height:"40px"}}/>
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
                (selectedOption === null && droppedOrder.length === 0) ||
                isButtonDisabled
              }
              className={`${
                currentQuestionIndex === questions.length - 1
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
    </>
  );
};

export default TaskModal;
