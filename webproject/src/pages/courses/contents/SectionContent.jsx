import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import bgtask from "../../../assets/bgtask.svg";
import bgvideo from "../../../assets/videolessonthumb.svg";
import SubscriptionErrorModal from "../SubscriptionErrorModal"; // Import the modal
import Modal from "../../../helpers/Modal";
import MessageModal from "./MessageModal";
import { Link } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Check, Video } from "lucide-react";

const SectionContent = ({
  section,
  chapter,
  openVideoModal,
  openTaskModal,
  hasSubscription,
  t,
}) => {
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // const containerWidth = 640;
  // let containerHeight = 1200;
  // const itemWidth = 200;
  // const baseRowHeight = 90;
  // const xOffset = 220;
  // const yOffset = 150;
  let isBlocked = !hasSubscription;
  let completedTill = 0;
  for (let i=0;i<chapter.contents.length;i++){
    let content = chapter.contents[i];
    if (content.is_completed){
      completedTill = i;
    }
  }
  completedTill+=1;
  for (let i=completedTill;i<chapter.contents.length;i++){
    let content = chapter.contents[i];
    if (content.is_completed){
      completedTill = i;
      break;
    }
  }
  // if (chapter.contents) {
  //   containerHeight = chapter.contents.length * 160;
  // };


  console.log(completedTill, chapter);

  return (
    <div className="lessonsCont">
      <h2
        className="defaultStyle title"
        style={{ color: "black", fontWeight: "700" }}
      >
        {t("courseStart")}
      </h2>
      <div className="contWrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <hr className="lessonsHr" />
          <h2 className="defaultStyle" style={{ color: "#aaa" }}>
            {section.title} {chapter.title}
          </h2>
          <hr className="lessonsHr" />
        </div>
        <div
          // style={{
          //   position: "relative",
          //   width: containerWidth,
          //   height: containerHeight,
          //   margin: "0 auto",
          // }}
        >
          <div className="lessonsLinks">
            {chapter.contents && chapter.contents.map((content, contentIndex) => {
              console.log(completedTill);
              const isTask = content.content_type === "task";
              const isLesson = content.content_type === "lesson";
              let isDisabled = false;
              if (isBlocked || contentIndex>completedTill) {
                  isDisabled = true;
                }
              return ( 
                <li
                  key={content.id}
                  className={`sectionItem ${
                    content.is_completed ? "activeSection" : ""
                  } ${!isDisabled ? "" : "noTask"}`}
                >
                  <p>{content.title}</p>
                  <div className="sectionProgress">
                    {/* <p className="defaultStyle">
                      {t("completedTasks1")}
                      {chapter.completed_tasks}
                      {t("completedTasks2")}
                      {chapter.total_tasks} {t("completedTasks3")}
                    </p> */}
                    {/* <progress 
                      value={
                        chapter.percentage_completed ? 
                          chapter.percentage_completed/100 : chapter.completed_tasks/chapter.total_tasks
                      } 
                    /> */}
                  </div>
                  <button 
                    className="orangeButton"
                    onClick={()=>{
                      console.log(isDisabled)
                      if (!isDisabled){
                        if (content.content_type==="task"){
                          openTaskModal(content.id)
                        }else{
                          openVideoModal(content.video_url);
                        }
                      } else{
                        if (hasSubscription){
                          setShowMessage(true);
                        }else{
                          setShowSubscriptionError(true);
                        }
                      }
                    }}
                  >
                    {isTask && !content.is_completed &&  <PlayArrowIcon />}
                    {isTask && content.is_completed &&  <Check />}
                    {isLesson && <Video />}
                  </button>
                </li>
              )
            })}
          </div>
        </div>
      </div>

      {showSubscriptionError && (
        <SubscriptionErrorModal
          setShowSubscriptionError={setShowSubscriptionError}
          t={t}
        />
      )}
      {
        showMessage && (
          <Modal onClose={() => setShowMessage(false)}>
            <MessageModal message={"Вам надо закончить прошлое задание"} />
          </Modal>
        )
      }
    </div>
  );
};

export default SectionContent;
