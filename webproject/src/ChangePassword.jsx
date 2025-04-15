import React, { useState, useEffect } from "react";
import logoImg from "/src/assets/logo_blue.webp";
import { useTranslation } from "react-i18next";
import { resetPassword, checkResetPasswordToken } from "./utils/apiService";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const ChangePassword = () => {
  const { t } = useTranslation();
  const [tokenValidity, setTokenValidity] = useState(null); // null = loading
  const [linkValidity, setLinkValidity] = useState(null)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isValid = await checkResetPasswordToken(token);
        setTokenValidity(isValid);
        if (!isValid) {
          setMessage(t("Ссылка для сброса пароля недействительна. Пожалуйста, запросите новую ссылку."));
        }
        console.log(isValid);
      } catch (error) {
        console.log(error.message)
        if (error.message === "Ссылка не действительна. Запросите новую ссылку.") {
          setLinkValidity(false)
        }
        setTokenValidity(false);
        setMessage(error.message);
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latinRegex = /^[A-Za-z0-9!@#\$%\^\&*\)\(+=._-]+$/;
    if (!latinRegex.test(password) || !latinRegex.test(confirmPassword)) {
      toast.error(t("Пароль должен содержать только латинские буквы."));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("Пароли не совпадают."));
      return;
    }

    try {
      await resetPassword(password, token);
      toast.success(t("Пароль успешно изменен!"));
      setShowModal(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="regacss">
      <div className="renewPage">
        <div className="regform">
          <img src={logoImg} alt="logo" className="navLogo" />
          <h2 style={{ animation: "none" }}>{t("passwordRenewal")}</h2>

          {tokenValidity === null ? (
            <p>{t("Проверка ссылки...")}</p>
          ) : tokenValidity === false ? (

            <><p>{message}</p>
              {linkValidity === false && (
                <Link to="/password-renewal">
                  <button style={{ marginTop: "20px" }}>
                    {t("Запросить новую ссылку")}
                  </button>
                </Link>
              )}</>
          ) : (
            <>
              <form className="registrationInput" onSubmit={handleSubmit}>
                <label htmlFor="password">{t("enterNewPassword")}</label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder={t("enterNewPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">{t("confirmNewPassword")}</label>
                <input
                  type="text"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder={t("confirmNewPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p style={{ marginTop: "10px", color: "#888" }}>
                  {t("Запишите или сфотографируйте пароль")}
                </p>
                <button
                  type="submit"
                  style={{ maxWidth: "200px", marginTop: "20px" }}
                >
                  {t("send")}
                </button>
              </form>
              {message && <p>{message}</p>}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <dialog className="modal supermodal" open>
          <div className="modal-content">
            <h1 style={{ animation: "none" }}>{t("Пароль успешно изменен!")}</h1>
            <Link to="/">
              <button onClick={() => setShowModal(false)}>
                {t("Войти в аккаунт")}
              </button>
            </Link>
          </div>
        </dialog>
      )}
      <ToastContainer />

    </div>
  );
};

export default ChangePassword;
