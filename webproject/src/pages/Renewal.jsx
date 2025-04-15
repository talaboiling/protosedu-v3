import React, { useState } from "react";
import logoImg from "/src/assets/logo_blue.webp";
import { useTranslation } from "react-i18next";
import { requestResetPassword } from "../utils/apiService.js";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Renewal = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await requestResetPassword(username);
      toast.success(
        t(`Отправили ссылку на ваш e-mail: ${data.email}. Проверьте папку СПАМ!`)
      );
      setSuccess(true);
    } catch (error) {
      toast.error(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="regacss">
      <div className="renewPage">
        <div className="regform">
          <Link to="/">
            <img src={logoImg} alt="logo" className="navLogo" />
          </Link>
          <h2 style={{ animation: "none" }}>{t("passwordRenewal")}</h2>

          {success === null && (
            <form className="registrationInput" onSubmit={handleSubmit}>
              <label htmlFor="email">{t("pleaseWriteUsername")}</label>
              <input
                type="text"
                name="username"
                id="email"
                placeholder="maksat.bekturgun"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                type="submit"
                style={{ maxWidth: "200px", marginTop: "20px" }}
              >
                {t("send")}
              </button>
            </form>
          )}

          {success !== null && (
            <div>
              {success === true ? (
                <Link to="/">
                  <button>{t("back")}</button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setUsername("");
                    setSuccess(null);
                  }}
                >
                  {t("back")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Renewal;
