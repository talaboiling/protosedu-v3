import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import Loader from "../Loader";
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
} from "../../utils/apiService";
import { useTranslation } from "react-i18next";
import { set } from "react-hook-form";
import SeniorDashboardContent from "./SeniorDashboardContent";
import JuniorDashBoardContent from "./JuniorDashBoardContent";
import RightSidebar from "./rightSidebar/RightSidebar";

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
  const [isMenuOpen, setIsMenuOpen] = useState(true);
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
      <Sidebar isMenuOpen={isMenuOpen} user={user}/>
      <div className="centralDash">
        {user.grade>4 && <SeniorDashboardContent t={t} user={user} courses={courses} isMenuOpen={isMenuOpen}/>}
        {user.grade<=4 && 
        <JuniorDashBoardContent 
          user={user} 
          courses={courses} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          isProfileSwitched={isProfileSwitched}
          setIsProfileSwitched={setIsProfileSwitched}
          t={t}
          data={data}
          options={options}
        />}
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
