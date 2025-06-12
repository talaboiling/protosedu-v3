import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
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
import LockedContent from "./LockedContent";
import { ThumbsUp, X } from "lucide-react";

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

  const [lastOpenContent, setLastOpenContent] = useState(0);

  const navigate = useNavigate();

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

  useEffect(()=>{
    if (chapters && chapters.length>0){
      let lastOpen = 0;
      for (let i=0;i<chapters.length;i++){
        if (chapters[i].percentage_completed===100){
          if (chapters[i].after_diagnostic_test_detail){
            if (chapters[i].after_diagnostic_test_detail.is_finished){
              lastOpen=i+1;
            }
          }else{
            lastOpen=i+1;
          }
        }
      }
      setLastOpenContent(lastOpen);
    }
  },[chapters.length]);

  const handleClickSection = (sectionId) => {
    if (activeSection !== sectionId) {
      setIsActiveSection(sectionId);
    }
  };

  if (loading) {
    return <Loader />; // Display loader while fetching data
  }

  console.log(chapters, lastOpenContent);
  return (
    <div>
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
            {chapters.map((chapter,index) => {
              let open = false;
              let showBeforeTest = false;
              let showChapterContent = false;
              let showAfterTest  = false;
              if (index<=lastOpenContent){
                open = true;
              }
              console.log(open, index)
              if (open && chapter.before_diagnostic_test_detail){
                showBeforeTest = true;
              }
              if (open){
                if (chapter.before_diagnostic_test_detail){
                  if (chapter.before_diagnostic_test_detail?.is_finished){
                    showChapterContent = true;
                  }
                }else{
                  showChapterContent = true;
                }
              }
              if (showChapterContent && chapter.percentage_completed===100){
                showAfterTest = true;
              }
              return (
                <li className="sectionItem" style={{display:"flex",flexDirection: "column", padding:0}}>
                  {showBeforeTest && (
                    <div style={{display: "flex", gap: "1rem", alignItems:"center",justifyContent:"center"}}>
                      <p>Тест до:</p>
                      <button onClick={()=>window.open(`/dashboard/tests/${chapter.before_diagnostic_test_detail.id}/`, "_blank")}>{chapter.before_diagnostic_test_detail.title}</button>
                      {!chapter.before_diagnostic_test_detail.is_finished && (
                        <>
                          <p>Тест не пройден</p>
                          <X size={32} color="red"/>
                        </>
                      )}
                      {chapter.before_diagnostic_test_detail.is_finished && (
                        <>
                          <p>Тест пройден</p>
                          <ThumbsUp size={32} color="green"/>
                        </>
                      )}
                    </div>
                  )}
                  <div
                    key={chapter.id}
                    className={`sectionItem ${
                      chapter.total_tasks == chapter.completed_tasks && chapter.completed_tasks>0
                        ? "activeSection"
                        : ""
                    }`}
                    style={{position: "relative", overflow: "hidden", width: "100%", margin: 0, padding:0}}
                  >
                    {!open && <LockedContent></LockedContent>}
                    {open && !showChapterContent && <LockedContent message={"Пройдите сначала тест выше"}></LockedContent>}
                    <p>{chapter.title}</p>
                    <div className="sectionProgress">
                      <p className="defaultStyle">
                        {t("completedTasks1")}
                        {chapter.completed_tasks}
                        {t("completedTasks2")}
                        {chapter.total_tasks} {t("completedTasks3")}
                      </p>
                      <progress
                        value={
                          chapter.percentage_completed
                            ? chapter.percentage_completed / 100
                            : chapter.completed_tasks / chapter.total_tasks
                        }
                      />
                    </div>
                    <Link
                      to={`/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapter.id}/lessons`}
                    >
                      <button className="orangeButton">
                        <PlayArrowIcon />
                      </button>
                    </Link>
                  </div>
                  {showAfterTest && (
                    <div style={{display: "flex", gap: "1rem", alignItems:"center",justifyContent:"center"}}>
                      <p>Тест до:</p>
                      <button onClick={()=>window.open(`/dashboard/tests/${chapter.after_diagnostic_test_detail.id}/`, "_blank")}>{chapter.after_diagnostic_test_detail.title}</button>
                      {!chapter.after_diagnostic_test_detail.is_finished && (
                        <>
                          <p>Тест не пройден</p>
                          <X size={32} color="red"/>
                        </>
                      )}
                      {chapter.after_diagnostic_test_detail.is_finished && (
                        <>
                          <p>Тест пройден</p>
                          <ThumbsUp size={32} color="green"/>
                        </>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;
