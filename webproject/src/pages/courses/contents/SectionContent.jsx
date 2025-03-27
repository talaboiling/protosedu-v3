import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import bgtask from "../../../assets/bgtask.svg";
import bgvideo from "../../../assets/videolessonthumb.svg";
import SubscriptionErrorModal from "../SubscriptionErrorModal"; // Import the modal

const SectionContent = ({
  section,
  chapter,
  openVideoModal,
  openTaskModal,
  hasSubscription,
  t,
}) => {
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);

  const containerWidth = 640;
  let containerHeight = 1200;
  const itemWidth = 200;
  const baseRowHeight = 90;
  const xOffset = 220;
  const yOffset = 150;

  if (chapter.contents){
    containerHeight = chapter.contents.length * 160;
  }

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
          style={{
            position: "relative",
            width: containerWidth,
            height: containerHeight,
            margin: "0 auto",
          }}
        >
        <div className="lessonsLinks">
          {chapter.contents && chapter.contents.map((content, contentIndex) => {
            const row = Math.floor(contentIndex / 2);
            const col = contentIndex % 2;
            const top = contentIndex * yOffset;

            const isEvenRow = row % 2 === 0;
            let style = {
              position: "absolute",
              top: top,
              width: itemWidth,
              height: itemWidth,
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "hidden"
            };

            if (isEvenRow) {
              style.left = col * xOffset;
              console.log(style.left);
            } else {
              style.left = containerWidth - itemWidth - col * xOffset;
            }
            return (
                <>
                {content.content_type === "lesson" ? (
                  <div
                    className={`vidBlock studVidBlock ${
                      hasSubscription ? "" : "noVidBlock"
                    }`}
                    onClick={() =>
                      hasSubscription
                        ? openVideoModal(content.video_url)
                        : setShowSubscriptionError(true)
                    }
                    style={style}
                    key={contentIndex}
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
                    className={`studVidBlock task ${
                      hasSubscription ? "" : "noTask"
                    }`}
                    onClick={() =>
                      hasSubscription
                        ? openTaskModal(content.id)
                        : setShowSubscriptionError(true)
                    }
                    style={{...style, backgroundColor: "#97d4e7"}}
                    key={contentIndex}
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
                    {content.is_completed ? (
                      <div className="completedTask">
                        <VerifiedIcon sx={{ color: "#19a5fc" }} />
                        <strong>{t("youCompletedTask")}</strong>
                      </div>
                    ) : (
                      <div className="completedTask incompleteTask">
                        <strong>{t("youHaveNewTask")}</strong>
                      </div>
                    )}
                  </div>
                )}
                </>
            );
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
    </div>
  );
};

export default SectionContent;
