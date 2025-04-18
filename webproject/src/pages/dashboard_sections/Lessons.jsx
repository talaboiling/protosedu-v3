import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import mathIcon from "../../assets/calculator.webp";
import englishIcon from "../../assets/english.webp";
import placeholderPfp from "../../assets/placehoder_pfp.webp"; // Import the placeholder image
import cupicon from "../../assets/navCups.webp";
import League from "./League";
import certbanner from "../../assets/certbanner.webp";
import cert90 from "../../assets/90lessons.webp";
import cert200 from "../../assets/200lessons.webp";
import cert500 from "../../assets/500lessons.webp";
import Loader from "../Loader";
import { fetchUserData } from "../../utils/apiService";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const Lessons = () => {
  const {isMenuOpen, setIsMenuOpen} = useOutletContext();
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values

  const [loading, setLoading] = useState(true); // Add loading state
  const avatarUrl = user.avatar || placeholderPfp; // Use placeholder if avatar is null
  const [status, setStatus] = useState("");

  const [isCertificatesSwitched, setIsCertificatesSwitched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const userData = await fetchUserData(childId);
        setUser(userData);

        // Calculate status based on the fetched userData
        let user_status = "";
        if (userData.has_subscription && !userData.is_free_trial) {
          user_status = "ПРЕМИУМ";
        } else if (userData.has_subscription && userData.is_free_trial) {
          user_status = "ПРОБНЫЙ ПЕРИОД";
        } else {
          user_status = "НЕТ ПОДПИСКИ";
        }
        setStatus(user_status);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this runs once on mount

  if (loading) {
    return <Loader></Loader>;
  }
  return (
    <div className="rtdash centralDash certpage">
      <div className="centralLessons">
        <div className="centralLessonsInner">
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isCertificatesSwitched={isCertificatesSwitched}
            setIsCertificatesSwitched={setIsCertificatesSwitched}
            urlPath={"certificate"}
          />
        </div>
        <div className="mainContent">
          <div className="ratingCentral">
            <div className="ratinginfo">
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
                    width: "100px",
                    height: "100px",
                  }}
                />
                <p
                  style={{
                    backgroundColor:
                      status === "ПРЕМИУМ"
                        ? "#FFD700" // Gold background for premium
                        : status === "ПРОБНЫЙ ПЕРИОД"
                        ? "#E0E0E0" // Light grey background for free trial
                        : "transparent", // No background for no subscription
                    fontSize: status === "ПРЕМИУМ" ? "large" : "medium",
                    fontWeight: status === "ПРЕМИУМ" ? "600" : "500",
                    color:
                      status === "ПРЕМИУМ"
                        ? "#069046" // Green color for premium
                        : status === "ПРОБНЫЙ ПЕРИОД"
                        ? "#333333" // Dark grey color for free trial
                        : "#666666", // Light grey color for no subscription
                    margin: "10px 0",
                    padding: status === "ПРЕМИУМ" ? "10px 20px" : "5px 10px",
                    textAlign: "center",
                    borderRadius: status === "ПРЕМИУМ" ? "5px" : "3px",
                    border: status === "ПРЕМИУМ" ? "2px solid #FFD700" : "none",
                  }}
                >
                  {status}
                </p>
                {(status === "НЕТ ПОДПИСКИ" || status === "ПРОБНЫЙ ПЕРИОД") && (
                  <Link
                    to="/subscription-details"
                    style={{
                      display: "inline-block",
                      margin: "10px 0",
                      padding: "10px 20px",
                      backgroundColor: "#7a32d1",
                      color: "#ffffff",
                      borderRadius: "5px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Перейти на премиум
                  </Link>
                )}
                <p
                  style={{
                    fontSize: "x-large",
                    fontWeight: "650",
                    color: "#222222",
                    margin: "0",
                    padding: "0",
                  }}
                >
                  {user.first_name} {user.last_name}
                </p>
                <p
                  style={{
                    fontSize: "large",
                    fontWeight: "450",
                    color: "#222222",
                    margin: "0",
                    padding: "0",
                  }}
                >
                  {t("student")}
                </p>
              </div>
              <div className="lndsh cupCount">
                <img src={cupicon} alt="cups" className="cupIcon" />
                <p style={{ margin: "0" }}>{user.cups}</p>
              </div>
              <League />
              <div className="downloadCert">
                <p
                  style={{
                    margin: "0",
                    color: "white",
                    fontWeight: "600",
                    textWrap: "wrap",
                  }}
                >
                  {t("downloadCertificate1")}
                  {t("downloadCertificate2")}
                </p>
                {/* <button className="orangeButton">{t("download")}</button>
                <form action="">
                  <input type="text" placeholder={t("yourMail")} />
                  <button>{t("send")}</button>
                </form> */}
              </div>
            </div>
            <div className="sectCertificates">
              <div className="certbanner">
                <h2
                  className="defaultStyle"
                  style={{
                    fontSize: "xx-large",
                    fontWeight: "800",
                    color: "white",
                    textAlign: "center",
                    textWrap: "wrap",
                  }}
                >
                  {t("myCerts")}
                </h2>
              </div>
              <div className="achievements">
                <ul className="certificates">
                  <li
                    className={`certificate c90 ${
                      user.tasks_completed > 90 ? "activeC90" : ""
                    }`}
                  >
                    <img src={cert90} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      {t("pass1")}{" "}
                      <b style={{ fontWeight: "800", color: "#91DCB3" }}>90</b>{" "}
                      {t("pass2")}
                    </p>
                  </li>
                  <li
                    className={`certificate c200 ${
                      user.tasks_completed > 200 ? "activeC200" : ""
                    }`}
                  >
                    <img src={cert200} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      {t("pass1")}{" "}
                      <b style={{ fontWeight: "800", color: "#FFD991" }}>200</b>{" "}
                      {t("pass2")}
                    </p>
                  </li>
                  <li
                    className={`certificate c500 ${
                      user.tasks_completed > 500 ? "activeC500" : ""
                    }`}
                  >
                    <img src={cert500} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      {t("pass1")}{" "}
                      <b style={{ fontWeight: "800", color: "#FF7763" }}>500</b>{" "}
                      {t("pass2")}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
