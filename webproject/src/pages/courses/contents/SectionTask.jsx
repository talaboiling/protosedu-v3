import React from 'react'

const SectionTask = ({content, contentIndex}) => {
    const isTask = content.content_type === "task";
    const isLesson = content.content_type === "lesson";
    const row = Math.floor(contentIndex / 2);
    const col = contentIndex % 2;
    const top = contentIndex * yOffset;

    let isDisabled = false;

    if (isTask) {
      if (isBlocked) {
        isDisabled = true;
      }
      if (!content.is_completed) {
        isBlocked = true;
      }
    }

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
    } else {
      style.left = containerWidth - itemWidth - col * xOffset;
    }

    return (
      <div key={contentIndex}>
        {isLesson ? (
          <div
            className={`vidBlock studVidBlock ${hasSubscription ? "" : "noVidBlock"}`}
            onClick={() =>
              hasSubscription
                ? openVideoModal(content.video_url)
                : setShowSubscriptionError(true)
            }
            style={style}
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
            className={`studVidBlock task ${hasSubscription && !isDisabled ? "" : "noTask"}`}
            onClick={() =>
              !isDisabled
                ? openTaskModal(content.id)
                : !hasSubscription ? setShowSubscriptionError(true): setShowMessage(true)
            }
            style={{ ...style, backgroundColor: "#97d4e7", opacity: isDisabled ? 0.5 : 1 }}
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
      </div>
    );
}

export default SectionTask
