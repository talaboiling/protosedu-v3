import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { FileUploader } from "react-drag-drop-files";
import logoImg from "../assets/logo_blue.webp";
import plusicon from "../assets/plus_icon.webp";
import "/src/dashboard.css";
import staricon from "../assets/navStars.webp";
import cupicon from "../assets/navCups.webp";
import streak from "../assets/streak.webp";
import nostreak from "../assets/nostreak.webp";
import i18next from "i18next";
import pfplaceholder from "../assets/placehoder_pfp.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { slide as Menu } from "react-burger-menu";
import { logout } from "../utils/authService";
import {
  fetchUserData,
  fetchChildren,
  addChild,
  deleteChild,
} from "../utils/apiService";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

const fileTypes = ["JPG", "PNG", "GIF"];

const Parentdash = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("parent"), last_name: "" }); // Default values
  const [children, setChildren] = useState([]); // State to store children
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(pfplaceholder);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade: "0",
    birth_date: "",
    gender: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [imageLoading, setImageLoading] = useState(true);
  const [checked, setChecked] = useState(i18next.language === "ru");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleImageLoading = () => {
    setImageLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loading) return;
        setLoading(true);
        console.log(1);
        const userData = await fetchUserData();
        const childrenData = await fetchChildren()
        // const [userData, childrenData] = await Promise.all([
        //   fetchUserData(),
        //   fetchChildren(),
        // ]);

        setUser(userData);
        setChildren(childrenData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(user, children)

  const handleFileChange = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = () => {
    const newLang = i18next.language === "ru" ? "kk" : "ru";
    i18next.changeLanguage(newLang);
    setChecked(newLang === "ru");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("grade", formData.grade);
    form.append("birth_date", formData.birth_date);
    form.append("gender", formData.gender);
    form.append("language", formData.language);
    if (file) {
      form.append("avatar", file);
    }

    try {
      await addChild(form);
      const childrenData = await fetchChildren(); // Fetch children data again to update the list
      setChildren(childrenData);
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChild(childToDelete);
      const childrenData = await fetchChildren(); // Fetch children data again to update the list
      setChildren(childrenData);
      setShowDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting child:", error);
    }
  };

  const handleNavigate = (childId) => {
    localStorage.setItem("child_id", childId);
    navigate(`/dashboard`);
  };

  const renderAddChildButtons = () => {
    const buttons = [];
    const remainingSlots = 3 - children.length;
    for (let i = 0; i < remainingSlots; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setShowModal(true)}
          className="addchildbtn"
        >
          <img src={plusicon} alt="add child" />
          <p style={{ fontSize: "x-large", fontWeight: "500" }}>
            {t("addChildButton")}
          </p>
        </button>
      );
    }
    return buttons;
  };

  if (loading) {
    return <Loader></Loader>;
  }


  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="parentdash">
      <div className="navBar" style={{ margin: "0" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img className="navLogo" src={logoImg} alt="logo" />
        </Link>
        <div className="excLogo mob-right">
          <div className="mailname">{user.email}</div>
          <div className="rndsh langSelect">
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
          <div className="navButton">
            <button onClick={handleLogout}>{t("exit")}</button>
          </div>
        </div>
        <div className="menuWrapper" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#00639E" }} />
        </div>
      </div>
      <Menu isOpen={isOpen} onStateChange={handleStateChange}>
        <div className="menuParentElmnts">
          <div className="mailname ">{user.email}</div>
          <div className="rndsh langSelect">
            <div className="button b2 " id="button-10">
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
          <div className="navButton">
            <button onClick={handleLogout}>{t("exit")}</button>
          </div>
        </div>
      </Menu>
      <div className="addchildren">
        {children.map((child) => (
          <div key={child.id} className="childcard">
            {imageLoading && <div className="skeleton"></div>}
            <img
              src={child.avatar || pfplaceholder}
              alt="child avatar"
              className="childAvatar"
              onLoad={handleImageLoading}
              loading="laze"
              style={{ display: imageLoading ? "none" : "block" }}
            />
            <p className="childName">
              {child.first_name} {child.last_name}
            </p>
            <div className="rndsh" style={{ marginBottom: "20px" }}>
              <p>
                {child.grade} {t("classLowercase")} (
                {child.language === "kz"
                  ? "Қаз"
                  : child.language === "ru"
                    ? "Рус"
                    : child.language === "en"
                      ? "Англ"
                      : ""}
                )
              </p>
            </div>
            <div className="lndshContainer">
              <div className="lndsh">
                <img src={staricon} alt="" className="starIcon" />
                <p>{child.stars}</p>
              </div>
              <div className="lndsh">
                <img src={cupicon} alt="" className="cupIcon" />
                <p>{child.cups}</p>
              </div>
            </div>
            <div className="lndshContainer">
              <div className="lndsh">
                <p>
                  {t("lvl")}: {child.level}
                </p>
              </div>
              <div className="lndsh">
                <img
                  src={child.streak !== 0 ? streak : nostreak}
                  alt="streak"
                  className="streakIcon"
                />
                <p>{child.streak}</p>
              </div>
            </div>

            <div className="childcardBtns">
              <button
                onClick={() => handleNavigate(child.id)}
                className="orangeButton"
              >
                {t("goToPlatform")}
              </button>
              <button
                onClick={() => {
                  setChildToDelete(child.id);
                  setShowDeleteModal(true);
                }}
                className="deleteButton"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}

        {renderAddChildButtons()}

        {showModal && (
          <dialog
            open
            className="modal supermodal"
            onClose={() => setShowModal(false)}
          >
            <div className="modal-content">
              <button
                onClick={() => setShowModal(false)}
                className="closeButton"
              >
                <CloseIcon sx={{ color: "grey" }} />
              </button>

              <form className="registrationInput" onSubmit={handleSubmit}>
                <div className="childavatar">
                  <img
                    src={imagePreview}
                    alt="pfp"
                    className="childAvatarPreview"
                  />
                  <FileUploader
                    handleChange={handleFileChange}
                    name="file"
                    types={fileTypes}
                  />
                </div>
                <label htmlFor="first_name">{t("firstNameChild")}</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Мақсат"
                  required
                />
                <label htmlFor="last_name">{t("lastNameChild")}</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Бектұрғын"
                  required
                />
                <label htmlFor="birth_date">{t("birthDate")}</label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  required
                />
                <div className="gendgrade">
                  <div>
                    <label htmlFor="gender">{t("gender")}</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t("choose_gender")}</option>
                      <option value="M">{t("boy")}</option>
                      <option value="F">{t("girl")}</option>
                      <option value="O">{t("other")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="grade">{t("studClass")}</label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="0">{t("preschool")}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="language">{t("study_language")}</label>
                <select
                  name="language"
                  id="language"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="">{t("choose_study_language")}</option>
                  <option value="ru">{t("russian")}</option>
                  <option value="kz">{t("kazakh")}</option>
                </select>
                <div className="submitContainer">
                  <button type="submit" className="submitButton">
                    {t("addChildButton")}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {showDeleteModal && (
          <dialog
            open
            className="modal studmodal"
            onClose={() => setShowDeleteModal(false)}
          >
            <div className="modal-content">
              <p>{t("confirmDelete")}</p>
              <button onClick={handleDelete}>{t("yes")}</button>
              <button onClick={() => setShowDeleteModal(false)}>
                {t("no")}
              </button>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default Parentdash;
