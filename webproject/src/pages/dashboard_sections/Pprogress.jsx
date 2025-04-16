import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Line } from "react-chartjs-2";
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
import { fetchUserData, fetchWeeklyProgress } from "../../utils/apiService";
import { getProgressForDay } from "../../utils/apiService"; // Import the new function
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/ru";

dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(localeData);

dayjs.locale("ru");
dayjs.updateLocale("ru", {
  week: {
    dow: 1, // Monday is the first day of the week
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Pprogress = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // State for selected date
  const [dailyProgress, setDailyProgress] = useState(null); // State for daily progress

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const [userData, weeklyProgressData] = await Promise.all([
          fetchUserData(childId),
          fetchWeeklyProgress(childId),
        ]);

        setUser(userData);
        setWeeklyProgress(weeklyProgressData.weekly_progress);
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

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const childId = localStorage.getItem("child_id");
    try {
      const progressData = await getProgressForDay(
        date.format("YYYY-MM-DD"),
        childId
      );
      setDailyProgress(progressData);
    } catch (error) {
      console.error("Error fetching daily progress:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rtdash progressPage">
      <Sidebar isMenuOpen={isMenuOpen} />
      <div className="centralDash">
        <Navdash
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isProfileSwitched={isProfileSwitched}
          setIsProfileSwitched={setIsProfileSwitched}
          urlPath={"dashboard"}
        />
        <h2 className="progressText">Прогресс</h2>
        <div className="centralProg">
          <div style={{ width: "100%", height: "200px" }}>
            <Line data={data} options={options} />
          </div>
          <div className="progcalendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={selectedDate} onChange={handleDateChange} />
            </LocalizationProvider>

            {dailyProgress !== null && (
              <div>
                {" "}
                <p>
                  {t("selected_date")}: {selectedDate.format("DD-MM-YYYY")}
                </p>
                <p>
                  {t("cups_for_selected_date")}: {dailyProgress.total_cups}
                </p>
                <p>
                  {t("total_correct_answers")}:{" "}
                  {dailyProgress.total_correct_answers}
                </p>
                <p>
                  {t("total_wrong_answers")}:{" "}
                  {dailyProgress.total_wrong_answers}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Profile user={user} />
    </div>
  );
};

export default Pprogress;
