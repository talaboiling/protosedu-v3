import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "./Sidebar";
import Navdash from "./Navdash";
import Profile from "./Profile";
import Loader from "./Loader";
import lionimg from "../assets/lion_hellocont.png";
import mathIcon from "../assets/calculator.png";
import englishIcon from "../assets/english.png";
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
  changePassword,
} from "../utils/apiService";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

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
        const weeklyProgressData = await fetchWeeklyProgress(childId);
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
    labels: weeklyProgress.map((day) => daysInRussian[day.day] || day.day),
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
        display: false,
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
    <div className="rtdash">
      <Sidebar />
      <div className="centralDash">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
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
            {courses.map((course) => (
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed / 100} />
                  <Link to={`/dashboard/courses/${course.id}/lessons`}>
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
      <Profile user={user} />
    </div>
  );
};

export default Dashboard;
