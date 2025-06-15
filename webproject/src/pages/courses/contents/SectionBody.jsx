import React from 'react'
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Check, Video } from "lucide-react";

const SectionBody = ({content, openTaskModal, openVideoModal, 
    setShowMessage, setShowSubscriptionError, isDisabled}) => {
    console.log(content);
    const isTask = content.content_type === "task";
    const isLesson = content.content_type === "lesson";

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
          style={{scale: "0.8"}}
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
}

export default SectionBody