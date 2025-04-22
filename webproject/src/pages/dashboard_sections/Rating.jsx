import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import cupicon from "../../assets/navCups.webp";
import League from "./League";
import tempRating from "../../assets/tempMainRating.webp";
import placeholderPfp from "../../assets/placehoder_pfp.webp"; // Import the placeholder image
import Ratinglist from "./Ratinglist"; // Import the Ratinglist component
import Loader from "../Loader";
import { fetchRatings, fetchUserData } from "../../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useOutletContext } from "react-router-dom";

const Rating = () => {
  const {isMenuOpen, setIsMenuOpen} = useOutletContext();
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [ratings, setRatings] = useState([]); // State to store ratings
  const [loading, setLoading] = useState(true); // Add loading state
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [checked, setChecked] = useState(i18next.language === "ru");

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        console.log("childId", childId);
        const userData = await fetchUserData(childId);
        const ratingsData = await fetchRatings(childId);

        setUser(userData);
        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = () => {
    const newLang = checked ? "ru" : "kk";
    i18next.changeLanguage(newLang);
    setChecked(!checked);
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <>
      <div className="centralLessons">
        <div style={{ width: "fit-content" }}>
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isProfileSwitched={isProfileSwitched}
            setIsProfileSwitched={setIsProfileSwitched}
            urlPath={"rating"}
          />
        </div>

        <div className="ratingCentral" style={{gap: "4rem"}}>
          <div className="listInRating">
            <Ratinglist ratings={ratings} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Rating;
