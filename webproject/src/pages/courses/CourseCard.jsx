import React from "react";
import mathIcon from "../../assets/calculator.webp";
import englishIcon from "../../assets/english.webp";

const CourseCard = ({ course, t }) => {
  return (
    <div className="courseItem" key={course.id}>
      <div className="courseItemLeft">
        <p style={{ margin: "0" }}>{course.name}</p>
        <progress value={course.percentage_completed/100} />
        <p className="defaultStyle">
          {t("completedTasks1")}
          {course.completed_tasks}
          {t("completedTasks2")}
          {course.total_tasks} {t("completedTasks3")}
        </p>
      </div>
      <img
        src={mathIcon}
        alt={course.name}
        style={{
          backgroundColor: "#F8753D",
          border: "1px solid black",
          borderRadius: "21px",
        }}
      />
    </div>
  );
};

export default CourseCard;
