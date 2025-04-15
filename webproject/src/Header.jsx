import { useState } from "react";
import mascotImg from "./assets/lionmascot_main.svg";
import logoImg from "./assets/logo_blue.webp";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./utils/authService";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { slide as Menu } from "react-burger-menu";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const { t } = useTranslation();
  const [checked, setChecked] = useState(i18next.language === "ru");

  const [isOpen, setIsOpen] = useState(false);
  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = () => {
    const newLang = i18next.language === "ru" ? "kk" : "ru";
    i18next.changeLanguage(newLang);
    setChecked(newLang === "ru");
  };

  return (
    <div className="headerImg">
      <div className="navBar" id="top1">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img className="navLogo" src={logoImg} alt="logo" />
          </Link>
          {/* <span>
            <p className="rev">{t("ourContacts")}:</p>
            <p className="rev">+7 775 303 7432</p>
          </span> */}
        </div>
        <div className="excLogo">
          <div className="navList">
            <div className="navLink dropdown">
              <a href="#oplatforme" className="navLink">
                {t("aboutPlatform")}
              </a>
              <div className="friendly-box"></div>
              <div className="dropdownContent">
                <Link to="/oferty" className="dropdownLink">
                  {t("platformPage1")}
                </Link>
                <Link to="/users-terms-and-conditions" className="dropdownLink">
                  {t("platformPage2")}
                </Link>
              </div>
            </div>
            <a href="#obuchenie" className="navLink">
              {t("education")}
            </a>
            <Link to="/ktp" className="navLink">КТП/КСП</Link>
            <a href="#otzyvy" className="navLink">
              {t("reviews")}
            </a>
            <a href="#contakty" className="navLink contacts">
              {t("contacts")}
            </a>
            <a href="/subscription-details" className="navLink">
              {t("tariff")}
            </a>
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
                <span style={{ fontWeight: "bold" }}>ҚАЗ</span>
              </div>
            </div>
          </div>
          <div className="navButton mob-right">
            {isLoggedIn ? (
              <div className="mob-right" style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  to={`${role === "superadmin"
                    ? "/admindashboard"
                    : role === "supervisor"
                      ? "/supervisor-dashboard"
                      : role === "parent"
                        ? "/parent"
                        : "/dashboard"
                    }`}
                  className="mob-right"
                  style={{ textDecoration: "none" }}
                >
                  <button>{t("continue")}</button>
                </Link>
                <button
                  className="orangeButton mob-none"
                  onClick={handleLogout}
                >
                  {t("exit")}
                </button>
              </div>
            ) : (
              <div className="mob-right" style={{ display: "flex", flexDirection: "column", width: "" }}>
                <Link to="/login" className="mob-right">
                  <button>{t("enter")}</button>
                </Link>
                {/* <Link to="/registration" className="orangeButtonWrapper">
                  <button className="orangeButton mob-none">
                    {t("register")}
                  </button>
                </Link> */}
              </div>
            )}
          </div>
        </div>
        <div className="menuWrapper" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#00639E" }} />
        </div>
      </div>
      <Menu isOpen={isOpen} onStateChange={handleStateChange}>
        <a
          href="#oplatforme"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("aboutPlatform")}
        </a>
        <a
          href="#obuchenie"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("education")}
        </a>
        <a
          href="#otzyvy"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("reviews")}
        </a>
        <a
          href="#contakty"
          className="menu-item burger-contacts"
          onClick={() => setIsOpen(false)}
        >
          {t("contacts")}
        </a>
        <a
          href="/subscription-details"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("tariff")}
        </a>
        <div className="langSelector burger-ln">
          <button className="" onClick={() => i18next.changeLanguage("ru")}>
            РУС
          </button>
          <button
            className=""
            style={{ marginLeft: "15px" }}
            onClick={() => i18next.changeLanguage("kk")}
          >
            ҚАЗ
          </button>
        </div>
        <div className="navButton">
          {isLoggedIn ? (
            <div>
              <Link
                to={`${role === "superadmin"
                  ? "/admindashboard"
                  : role === "supervisor"
                    ? "/supervisor-dashboard"
                    : role === "parent"
                      ? "/parent"
                      : "/dashboard"
                  }`}
                style={{ textDecoration: "none" }}
                className="mob-right burger-login"
              >
                <button className="mob-right burger-login">{t("continue")}</button>
              </Link>
              <Link className="orangeButtonWrapper">
                <button className="orangeButton" onClick={handleLogout}>
                  {t("exit")}
                </button>
              </Link>

            </div>
          ) : (
            <div>
              <Link to="/login" className="mob-right burger-login">
                <button>{t("enter")}</button>
              </Link>
              <Link to="/registration" className="orangeButtonWrapper">
                <button className="orangeButton" style={{ width: "100%" }}>
                  {t("register")}
                </button>
              </Link>
            </div>
          )}
        </div>
        <span>
          <p className="rev burger-rev">Наши контакты:</p>
          <p className="rev burger-rev">+7 775 303 7432</p>
        </span>
      </Menu>
      <div className="hooks">
        <div className="hook1">
          <div className="hook1Desc">
            <p className="mob-text" style={{ fontWeight: 600, margin: 0 }}>
              {t("eduAge")}
            </p>
            <div className="hook1Title">
              <span className="spanAnim">
                <h1>{t("mathEng1")}</h1>
              </span>
              <span className="spanAnim">
                <h1>{t("mathEng2")}</h1>
              </span>
              <span className="spanAnim">
                <h1>{t("mathEng3")}</h1>
              </span>
            </div>
            <Link to="/registration">
              <button
                style={{
                  padding: "10px 17px",
                  width: "60%",
                  marginTop: "2rem",
                  borderColor: "white",
                }}
              >
                {t("tryForFree")}
              </button>
            </Link>
          </div>
          <img src={mascotImg} alt="lionimg" className="mascotImg" />
        </div>
      </div>
    </div>
  );
}

export default Header;
