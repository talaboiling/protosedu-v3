import League from "./dashboard_sections/League";
import Ratinglist from "./dashboard_sections/Ratinglist";
import placeholderPfp from "../assets/placehoder_pfp.webp"; // Import the placeholder image
import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchRatings } from "../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./Profile.css";
import notification_image from "../../src/assets/Notification.png";
import SeniorMyGrowth from "./SeniorMyGrowth";

const Profile = ({ user, isProfileSwitched, setIsProfileSwitched }) => {
  const { t } = useTranslation();
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [ratings, setRatings] = useState([]); // State to store ratings
  const [status, setStatus] = useState("");

  const [checked, setChecked] = useState(i18next.language === "ru");

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const ratingData = await fetchRatings(childId);
        setRatings(ratingData);
      } catch (error) {
        console.error("Error fetching rating data:", error);
      } finally {
        let user_status = "";
        if (user.has_subscription && !user.is_free_trial) {
          user_status = "ПРЕМИУМ";
        } else if (user.has_subscription && user.is_free_trial) {
          user_status = "ПРОБНЫЙ ПЕРИОД";
        } else {
          user_status = "НЕТ ПОДПИСКИ";
        }
        setStatus(user_status);
      }
    };
    fetchData();
  }, [user.has_subscription, user.is_free_trial]);

  const handleChange = () => {
    const newLang = checked ? "ru" : "kk";
    i18next.changeLanguage(newLang);
    setChecked(!checked);
  };

  return (
    <div 
      className={`dashProfile ${isProfileSwitched ? "activeProfile" : ""} 
        ${user.grade>=4 ? "senior_right-sidebar" : ""}`}
    >
      {user.grade<4 && 
        <>
          <div
            className="backButton"
            onClick={() => setIsProfileSwitched(!isProfileSwitched)}
          >
            <FontAwesomeIcon icon={faXmark} style={{ color: "#339cbd" }} />
            </div>
            <div className="rndsh gradeNum off">
              {user.grade || user.gradeNum} {t("studClass")}
            </div>
            <div className="rndsh langSelect off">
              <div className="button b2" id="button-10">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={checked}
                  onChange={handleChange}
                />
                <div className="knobs">
                  <span>ҚАЗ</span>
                </div>
              </div>
            </div>
            <div className="prowfirst">
              <p
                style={{
                  fontSize: "x-large",
                  fontWeight: "650",
                  color: "#222222",
                  margin: "0",
                  padding: "0",
                }}
              >
                {t("myProfile")}
              </p>
            </div>
            <div className="sidepfp">
              <img
                src={avatarUrl}
                alt="pfp"
                className="pfp"
                style={{
                  borderRadius: "50%",
                  marginBottom: "15px",
                  width: "110px",
                  height: "110px",
                }}
              />
              <Link
                to={status === "ПРЕМИУМ" ? "#" : "/subscription-details"}
                style={{
                  display: "inline-block",
                  margin: "15px 0",
                  padding: "12px 24px",
                  background:
                    status === "ПРЕМИУМ"
                      ? "linear-gradient(135deg, #2FB0D7, #7B61FF)" // Blue-to-purple premium gradient
                      : status === "ПРОБНЫЙ ПЕРИОД"
                        ? "linear-gradient(135deg, #FFD700, #FFA500)" // Gold trial gradient
                        : "linear-gradient(135deg, #E0E0E0, #CCCCCC)", // Dimmed gray for no subscription
                  color: "#ffffff",
                  borderRadius: "25px", // Smooth pill-like shape
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  boxShadow:
                    status === "ПРЕМИУМ"
                      ? "0 4px 15px rgba(127, 97, 255, 0.5)" // Soft glow for premium
                      : status === "ПРОБНЫЙ ПЕРИОД"
                        ? "0 4px 12px rgba(255, 165, 0, 0.5)" // Glow for trial
                        : "0 4px 10px rgba(160, 160, 160, 0.3)", // Dim glow for no subscription
                  cursor: status === "ПРЕМИУМ" ? "default" : "pointer",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  if (status !== "ПРЕМИУМ") {
                    e.target.style.boxShadow = "0 6px 20px rgba(184, 87, 249, 0.6)";
                    e.target.style.transform = "scale(1.05)"; // Slight pop-out effect
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow =
                    status === "ПРОБНЫЙ ПЕРИОД"
                      ? "0 4px 12px rgba(255, 165, 0, 0.5)"
                      : "0 4px 10px rgba(160, 160, 160, 0.3)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                {status === "ПРЕМИУМ"
                  ? "✨ Премиум"
                  : status === "ПРОБНЫЙ ПЕРИОД"
                    ? "Пробный период"
                    : "Перейти на премиум"}
              </Link>



              <p
                style={{
                  fontSize: "x-large",
                  fontWeight: "650",
                  color: "#222222",
                  margin: "10px 0 0 0",
                  padding: "0",
                }}
              >
                {user.first_name} {user.last_name}
              </p>
              <p
                style={{
                  fontSize: "large",
                  fontWeight: "450",
                  color: "#666666",
                  margin: "5px 0 0 0",
                  padding: "0",
                }}
              >
                {t("student")}
              </p>
            </div>
        </>
        }
        {user.grade>=4 && (
          <>
          <div className="senior_top-bar">
              <div className="senior_notification">
                <img src={notification_image} className="senior_notification_img"/>
              </div>
              <div className="senior_profile">
                <div className="senior_avatar"><img src={user.avatar}/></div>
                <span className="senior_name">{user.first_name}</span>
                <span className="senior_arrow">▼</span>
              </div>
          </div>

          <SeniorMyGrowth t={t}/>
        </>
      )}
      <League />
      <Ratinglist ratings={ratings} />
    </div>
  );
};

export default Profile;
