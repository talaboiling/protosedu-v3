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
import SectionBody from "./SectionBody";

const SectionContent = ({
  section,
  chapter,
  openVideoModal,
  openTaskModal,
  hasSubscription,
  nodes,
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
  let completedTill = -1;
  let tasks = chapter.contents.filter(content=>content.content_type==="task");
  console.log(tasks);
  for (let i=0;i<tasks.length;i++){
    let content = tasks[i];
    if (content.is_completed){
      completedTill = content.order;
    }
  }
  for (let i=completedTill+1;i<chapter.contents.length;i++){
    let content = chapter.contents[i];
    if (content.content_type==="task"){
      completedTill = i;
      break;
    }
  }
  console.log(completedTill)
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
            {nodes && nodes.map(node=>{
              const task = chapter.contents.find(content=>content.id===node.task);
              const lesson = chapter.contents.find(content=>content.id===node.lesson);
              if (!lesson && !task) return;
              return (
              <>
                <div className="sectionItem" style={{display:"flex", fontSize: "14px"}}>
                  {lesson && (
                    <SectionBody 
                      content={lesson} 
                      openTaskModal={openTaskModal}
                      openVideoModal={openVideoModal}
                      setShowMessage={setShowMessage}
                      setShowSubscriptionError={setShowSubscriptionError}
                      isDisabled={isBlocked}
                    />
                  )}
                  {task && (
                    <SectionBody 
                      content={task} 
                      openTaskModal={openTaskModal}
                      openVideoModal={openVideoModal}
                      setShowMessage={setShowMessage}
                      setShowSubscriptionError={setShowSubscriptionError}
                      isDisabled={isBlocked}
                    />
                  )}
                </div>
              </>
              )
            })}
            {chapter.contents && chapter.contents.map((content, contentIndex) => {
              console.log(completedTill);
              return <SectionBody 
                content={content} 
                openTaskModal={openTaskModal}
                openVideoModal={openVideoModal}
                setShowMessage={setShowMessage}
                setShowSubscriptionError={setShowSubscriptionError}
                isDisabled={isBlocked || contentIndex>completedTill}
              />
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
