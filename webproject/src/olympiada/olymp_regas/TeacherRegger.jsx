import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.webp";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {slide as Menu} from "react-burger-menu";

function TeacherRegger() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    school: "",
    password: "",
    name: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setResponseMessage(
        t(
          "Пароль должен содержать минимум 8 символов, 1 заглавную букву и 1 цифру"
        )
      );
      setShowModal(true);
      return;
    }

    if (formData.password !== confirmPassword) {
      setResponseMessage(t("Пароли не совпадают."));
      setShowModal(true);
      return;
    }

    if (!captchaValue) {
      setResponseMessage(t("Пожалуйста пройдите CAPTCHA."));
      setShowModal(true);
      return;
    }

    const body = {
      email: formData.email,
      password: formData.password,
      school: formData.school,
      name: formData.name,
    };

    try {
      const data = await registerParent(body); // Use the function from apiService
      setResponseMessage(`${data.message}`);
      setShowHomeModal(true);
    } catch (error) {
      setResponseMessage(`Ошибка: ${error.message}`);
      setShowModal(true);
    } finally {
      setFormData({
        email: "",
        school: "",
        password: "",
        name: "",
      });
      setConfirmPassword("");
    }
  };

  const formatPhone = (e) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, ""); // Remove all non-digit characters
    if (value.startsWith("7") || value.startsWith("8")) {
      value = value.slice(1); // Remove the leading '7' or '8' if present
    }
    let formattedValue = "+7 ";

    if (value.length > 0) {
      formattedValue += "(" + value.slice(0, 3);
    }
    if (value.length >= 3) {
      formattedValue += ") " + value.slice(3, 6);
    }
    if (value.length >= 6) {
      formattedValue += " " + value.slice(6, 10);
    }

    setFormData({ ...formData, phone: formattedValue.slice(0, 18) });
  };

  const handlePhoneChange = (e) => {
    handleInputChange(e);
    formatPhone(e);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
          <div className="excLogo excLogoRega">
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
            <div className="navButton" style={{ marginLeft: "80px" }}>
              <Link to={"/login"}>
                <button className="mob-right">{t("enter")}</button>
              </Link>
            </div>
            <div className="menuWrapper" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} style={{color: "#00639E"}}/>
            </div>
          </div>
        </div>
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
          <div className="navButton" style={{  }}>
            <Link to={"/login"} className="mob-right burger-login">
              <button>{t("enter")}</button>
            </Link>
          </div>
        </Menu>
        <div className="regPage olympRegPage">
          <div className="regform">
            <div className="formTitle">
              <h3 className="form-h3">{t("Регистрация для Учителей")}</h3>
              <Link to="/login" className="formLink">
                {t("haveAccount")}
              </Link>
            </div>
            <form className="registrationInput" onSubmit={handleSubmit}>
              <label htmlFor="name">{t("Ваше имя и фамилия")}</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Мақсат Бектұрғын"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
                <label htmlFor="email">E-mail:</label>
                <input
                type="email"
                id="email"
                name="email"
                placeholder="maksat01@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                />
                <label htmlFor="school">{t("Название вашей школы")}</label>
                <input
                    type="text"
                    id="school"
                    name="school"
                    placeholder="Школа им. Абая"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                />
                {/* <span>
                  <label htmlFor="phone">{t("phone")}</label>
                  <br />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+7 (777) 123 4567"
                    maxLength={18}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    style={{ width: "350px" }}
                  />
                </span> */}
                <label htmlFor="password">{t("comeUpWithPassword")}</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
              <input
                type="submit"
                value={t("registration")}
                className="orangeButton"
                style={{
                  maxWidth: "200px",
                  float: "right",
                  marginTop: "25px",
                  marginBottom: "0",
                }}
              />
            </form>
          </div>
        </div>
        {showHomeModal && (
          <dialog className="modal supermodal" open>
            <div
              className="modal-content"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div className="">
                <button
                  className="transBtn"
                  onClick={() => setShowHomeModal(false)}
                  style={{ float: "right" }}
                >
                  <CloseIcon />
                </button>
              </div>
              {responseMessage}
              <Link to="/">
                <button
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color: "#666",
                  }}
                >
                  {t("continue")}
                </button>
              </Link>
            </div>
          </dialog>
        )}
        {showModal && (
          <dialog className="modal supermodal" open>
            <div
              className="modal-content"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {responseMessage}
              <button
                style={{
                  borderRadius: "10px",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  color: "#666",
                }}
                onClick={() => setShowModal(false)}
              >
                {t("continue")}
              </button>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
}

export default TeacherRegger;
