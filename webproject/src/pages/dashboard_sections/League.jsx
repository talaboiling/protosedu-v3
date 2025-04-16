import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'
import {
  fetchUserData,
  fetchWeeklyProgress,
} from "../../utils/apiService.js";
import React from 'react';
const League = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        // const [userData, coursesData, weeklyProgressData] = await [
        //   fetchUserData(childId),
        //   fetchCourses(childId),
        //   fetchWeeklyProgress(childId),
        // ];
        const userData = await fetchUserData(childId);
        setUser(userData);
        const weeklyProgressData = await fetchWeeklyProgress(childId);
        setWeeklyProgress(weeklyProgressData.weekly_progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <>
      {user.grade>4 && (
        <div className="senior_bronze-league">
            <p>Ты в <strong>БРОНЗОВОЙ ЛИГЕ!</strong></p>
            <div className="senior_league-icons">
              🥉 🥈 🥇 🏆
            </div>
        </div>
      )}
      {user.grade<=4 && (
        <div className='league'>
            <p style={{width:"80%", marginBottom:"0", marginTop:"0"}}>
                {t ('youAreIn')}
            </p>
            <p style={{fontSize:"xx-large", margin:"10px"}}>
              {user.level}
            </p>
            {t('keepItUp')}
        </div>
      )}
    </>
  )
}

export default League