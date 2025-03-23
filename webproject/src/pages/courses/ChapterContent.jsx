import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Loader from "../Loader";
import CourseCard from "../courses/CourseCard";
import lionimg from "../../assets/lion_hellocont.webp";
import mathIcon from "../../assets/calculator.webp";
import englishIcon from "../../assets/english.webp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  fetchUserData,
  fetchCourse,
  fetchSection,
  fetchChapters,
} from "../../utils/apiService";
import { useTranslation } from "react-i18next";

const ChapterContent = () => {
  const { t } = useTranslation();
  const { courseId, sectionId } = useParams();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [course, setCourse] = useState(); // State to store courses
  const [section, setSection] = useState([]); // State to store sections
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [activeSection, setIsActiveSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        // const [userData, coursesData, weeklyProgressData] = await [
        //   fetchUserData(childId),
        //   fetchCourses(childId),
        //   fetchWeeklyProgress(childId),
        // ];
        const userData = await fetchUserData(childId);
        console.log("userData", userData);
        setUser(userData);
        const courseData = await fetchCourse(courseId, childId);
        setCourse(courseData);
        const sectionData = await fetchSection(courseId, sectionId, childId);
        setSection(sectionData);
        const chaptersData = await fetchChapters(courseId, sectionId, childId);
        setChapters(chaptersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, sectionId]);

  const handleClickSection = (sectionId) => {
    if (activeSection !== sectionId) {
      setIsActiveSection(sectionId);
    }
  };

  if (loading) {
    return <Loader />; // Display loader while fetching data
  }
  return (
    <div className="rtdash dashMain">
      <Sidebar isMenuOpen={isMenuOpen} />
      <div className="centralDash">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isProfileSwitched={isProfileSwitched}
          setIsProfileSwitched={setIsProfileSwitched}
          urlPath={"dashboard"}
        />
        <div className="mainContent">
          <div className="coursesCards">
            <CourseCard course={course} t={t} />
          </div>
          <div className="courseNavigation">
            <Link to={`/dashboard/courses/${courseId}/sections`}>
              <p
                className="defaultStyle courseNav"
                id={
                  window.location.pathname ===
                  `/dashboard/courses/${courseId}/sections`
                    ? "active"
                    : ""
                }
              >
                {t("sections")}
              </p>
            </Link>
            <Link
              to={`/dashboard/courses/${courseId}/sections/${sectionId}/chapters`}
            >
              <p
                className="defaultStyle courseNav"
                id={
                  window.location.pathname ===
                  `/dashboard/courses/${courseId}/sections/${sectionId}/chapters`
                    ? "active"
                    : ""
                }
              >
                {t("topics")}
              </p>
            </Link>
          </div>
          <ul className="sectionsList">
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                className={`sectionItem ${
                  activeSection === chapter.id ? "activeSection" : ""
                }`}
                onClick={() => handleClickSection(chapter.id)}
              >
                <p>{chapter.title}</p>
                <div className="sectionProgress">
                  <p className="defaultStyle">
                    {t("completedTasks1")}
                    {chapter.completed_tasks}
                    {t("completedTasks2")}
                    {chapter.total_tasks} {t("completedTasks3")}
                  </p>
                  <progress value={chapter.percentage_completed/100} />
                </div>
                <Link
                  to={`/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapter.id}/lessons`}
                >
                  <button className="orangeButton">
                    <PlayArrowIcon />
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;
