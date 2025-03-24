import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.webp";
import { loginUser, logout } from "../utils/authService";
import { useTranslation } from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {slide as Menu} from "react-burger-menu";
import Loader from "./Loader.jsx";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showErrModal, setShowErrModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      setLoading(true);
      const user = await loginUser(formData.username, formData.password);
      // console.log("Logged in user:", user); // Debugging log
      setResponseMessage(t("loginSuccessful"));
      if (user.is_superuser) {
        //console.log("Navigating to /admindashboard");
        navigate("/admindashboard"); // Redirect to admin dashboard
      } else if (user.role === "supervisor") {
        //console.log("Navigating to /supervisor-dashboard");
        navigate("/supervisor-dashboard"); // Redirect to supervisor dashboard
      } else if (user.role === "parent") {
        //console.log("Navigating to /parent");
        navigate("/parent"); // Redirect to parent dashboard
      } else if (user.role === "student") {
        //console.log("Navigating to /dashboard");
        navigate("/dashboard"); // Redirect to student dashboard
      } else {
        //console.log("Navigating to /login");
        navigate("/login"); // Default redirect to login
      }
    } catch (error) {
      setResponseMessage("Ошибка: " + error.message);
      setShowErrModal(true);
      console.error("Login error:", error); // Debugging log
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="regacss">
        <div className="navBar" style={{ justifyContent: "space-around" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              className="navLogo"
              src={logoImg}
              alt="logo"
              style={{ marginRight: "100px" }}
            />
          </Link>
          <Menu isOpen={isOpen} onStateChange={handleStateChange}>
            <a href="#oplatforme" className="menu-item" onClick={() => setIsOpen(false)}>
              {t('aboutPlatform')}
            </a>
            <a href="#obuchenie" className="menu-item" onClick={() => setIsOpen(false)}>
              {t('education')}
            </a>
            <a href="#otzyvy" className="menu-item" onClick={() => setIsOpen(false)}>
              {t('reviews')}
            </a>
            <a href="#contakty" className="menu-item" onClick={() => setIsOpen(false)}>
              {t('contacts')}
            </a>
            <a href="/subscription-details" className="menu-item" onClick={() => setIsOpen(false)}>
              {t("tariff")}
            </a>
          </Menu>
          <div className="excLogo">
            <div className="menuWrapper" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} style={{color: "#00639E"}}/>
            </div>
            <div className="navList">
              <a href="/#oplatforme" className="navLink">
                {t("aboutPlatform")}
              </a>
              <a href="/#obuchenie" className="navLink">
                {t("education")}
              </a>
              <a href="/#otzyvy" className="navLink">
                {t("reviews")}
              </a>
              <a href="/#contakty" className="navLink">
                {t("contacts")}
              </a>
              <a href="/subscription-details" className="navLink">
                {t("tariff")}
              </a>
            </div>
          </div>
        </div>
        <div
          className="regPage"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="regform">
            <div className="formTitle">
              <h3 className="form-h3">{t("login")}</h3>
              <Link to={"/registration"} className="formLink">
                {t("noAccount")}
              </Link>
            </div>
            <form className="registrationInput" onSubmit={handleSubmit}>
              <label htmlFor="username">{t("userName")}</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="maqsat.bekturgyn"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">{t("yourPassword")}</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Link to={"/password-renewal"} className="formLink">
                {t("forgotPassword")}
              </Link>
              <br />
              <input
                type="submit"
                value={t("loginButton")}
                className="orangeButton"
                style={{
                  position: "relative",
                  maxWidth: "200px",
                  marginBottom: "0",
                }}
              />
            </form>
          </div>
          {showErrModal && (
            <dialog
              open
              className="modal supermodal"
              onClose={() => setShowErrModal(false)}
            >
              <div
                className="modal-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  border: "3px solid darkred",
                }}
              >
                {responseMessage}
                <button
                  onClick={() => setShowErrModal(false)}
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color: "#666",
                  }}
                >
                  Продолжить
                </button>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
