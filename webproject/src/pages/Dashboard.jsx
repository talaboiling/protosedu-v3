import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "./Sidebar";
import Navdash from "./Navdash";
import Profile from "./Profile";
import Loader from "./Loader";
import lionimg from "../assets/lionDash.svg";
import mathIcon from "../assets/calculator.webp";
import englishIcon from "../assets/english.webp";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  fetchUserData,
  fetchCourses,
  fetchWeeklyProgress,
  fetchDailyMessageStudent,
  fetchSections,
  changePassword,
} from "../utils/apiService";
import { useTranslation } from "react-i18next";
import { set } from "react-hook-form";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
  const [sections, setSections] = useState([]); // State to store sections
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [dailyMessage, setDailyMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const userData = await fetchUserData(childId);
        console.log("userData", userData);
        setUser(userData);
        const weeklyProgressData = await fetchWeeklyProgress(childId);
        console.log(weeklyProgressData);
        setWeeklyProgress(weeklyProgressData.weekly_progress);
        const coursesData = await fetchCourses(childId);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchDailyMessage = async () => {
  //     try {
  //       const dailyMessageData = await fetchDailyMessageStudent(i18n.language);
  //       console.log("dailyMessageData", dailyMessageData);
  //       setDailyMessage(dailyMessageData.message);
  //     } catch (error) {
  //       setDailyMessage("");
  //       console.error("Error fetching daily message:", error);
  //     }
  //   };
  //   fetchDailyMessage();
  // }, [i18n.language]);

  const daysInRussian = {
    Monday: t("mon"),
    Tuesday: t("tue"),
    Wednesday: t("wed"),
    Thursday: t("thu"),
    Friday: t("fri"),
    Saturday: t("sat"),
    Sunday: t("sun"),
  };

  const data = {
    labels: weeklyProgress.length > 0 ? weeklyProgress.map((day) => daysInRussian[day.day] || day.day) : [],
    datasets: [
      {
        label: t("cups"),
        data: weeklyProgress.map((day) => day.cups),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("cups"),
          font: {
            size: 20,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // We hide the legend for this chart as it's simple
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
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
          <h2 style={{ color: "#22222244" }}>{t("main")}</h2>
          <div className="helloContent">
            <span className="helloCont">
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "xx-large",
                  color: "#222222ef",
                  margin: "0",
                  marginBottom: "15px",
                }}
              >
                {t("hello")}, <strong>{user.first_name}</strong>
              </p>
              <p
                style={{
                  fontWeight: "500",
                  color: "#2222229f",
                  maxWidth: "70%",
                  margin: "0",
                }}
              >
                {/* {dailyMessage || `${t("quote1")} ${t("quote2")}`} */}
                {t("quote1")}
                {t("quote2")}
              </p>
            </span>
            <img
              src={lionimg}
              alt="mascot"
              style={{
                position: "absolute",
                top: "-50px",
                left: "70%",
                scale: "1.2",
              }}
            />
          </div>

          <h3
            style={{ color: "black", fontWeight: "700", fontSize: "x-large" }}
          >
            {t("myCourses")}
          </h3>
          <div className="coursesCards">
            {courses.map((course, section) => (
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed / 100} />
                  <Link to={`/dashboard/courses/${course.id}/sections`}>
                    <button
                      style={{
                        backgroundColor: "#F8753D",
                        fontWeight: "550",
                        fontSize: "large",
                        borderColor: "#FFB99C",
                        boxShadow: "none",
                      }}
                    >
                      {t("begin")}
                    </button>
                  </Link>
                </div>
                <img
                  src={course.name === "Математика" ? mathIcon : englishIcon}
                  alt={course.name}
                  className="courseImage"
                  style={{
                    backgroundColor: "#F8753D",
                    border: "1px solid black",
                    borderRadius: "21px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="progressChart">
            <div style={{ width: "100%", height: "200px" }}>
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
      <Profile
        user={user}
        isProfileSwitched={isProfileSwitched}
        setIsProfileSwitched={setIsProfileSwitched}
      />
    </div>
  );
};

export default Dashboard;
