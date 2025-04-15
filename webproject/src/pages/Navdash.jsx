import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import staricon from "../assets/navStars.webp";
import cupicon from "../assets/navCups.webp";
import streak from "../assets/streak.webp";
import nostreak from "../assets/nostreak.webp";
import { fetchUserData } from "../utils/apiService"; // Import the fetch function
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCalendarDays,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navdash = (props) => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [checked, setChecked] = useState(i18next.language === "ru");

  useEffect(() => {
    const fetchUser = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const userData = await fetchUserData(childId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
    setChecked(i18next.language === "ru");
  }, []);

  const handleChange = () => {
    const newLang = i18next.language === "ru" ? "kk" : "ru";
    i18next.changeLanguage(newLang);
    setChecked(newLang === "ru");
  };

  return (
    <div className="navdashboard">
      <div
        className="icons burger"
        onClick={() => {
          props.setIsMenuOpen(!props.isMenuOpen);
          props.setIsProfileSwitched(false);
        }}
      >
        <FontAwesomeIcon icon={faBars} style={{ color: "#00639E" }} />
      </div>
      <div className="lndsh starCount">
        <img src={staricon} alt="stars" className="starIcon" />
        {user.stars || props.starCount}
      </div>
      <div className="lndsh cupCount">
        <img src={cupicon} alt="cups" className="cupIcon" />
        {user.cups || props.cupCount}
      </div>
      <div className="lndsh cupCount">
        <img
          src={user.streak !== 0 ? streak : nostreak}
          alt="streak"
          className="cupIcon"
        />
        {user.streak}
      </div>
      {props.urlPath === "dashboard" ? (
        <div
          className="icons profile"
          onClick={() => {
            props.setIsProfileSwitched(!props.isProfileSwitched);
            props.setIsMenuOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faUser} style={{ color: "#339cbd" }} />
        </div>
      ) : null}
      {props.urlPath === "lesson" ? (
        <div
          className="icons program"
          onClick={() => {
            props.setIsProgramSwitched(!props.isProgramSwitched);
            props.setIsMenuOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#339cbd" }} />
        </div>
      ) : null}
      <div className="rndsh gradeNum">
        {user.grade || props.gradeNum} {t("studClass")}
      </div>
      <div className="rndsh langSelect">
        <div className="button b2" id="button-10">
          <input
            type="checkbox"
            className="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          <div className="knobs">
            <span><strong>ҚАЗ</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

Navdash.propTypes = {
  starCount: PropTypes.number,
  cupCount: PropTypes.number,
  gradeNum: PropTypes.number,
  langSelect: PropTypes.bool,
  notif: PropTypes.number,
  setIsMenuOpen: PropTypes.func.isRequired,
  setIsProfileSwitched: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool,
  isProfileSwitched: PropTypes.bool,
  urlPath: PropTypes.string,
};

Navdash.defaultProps = {
  starCount: 0,
  cupCount: 0,
  gradeNum: 1,
  langSelect: false,
  notif: 0,
  isMenuOpen: false,
  isProfileSwitched: false,
  urlPath: "dashboard",
};

export default Navdash;
