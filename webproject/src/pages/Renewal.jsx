import React, { useState } from "react";
import logoImg from "/src/assets/logo_blue.webp";
import { useTranslation } from "react-i18next";
import { requestResetPassword } from "../utils/apiService.js";
import { Link } from "react-router-dom";

const Renewal = () => {
  const { t } = useTranslation();
  // const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestResetPassword(username);
      setMessage(t("Отправили ссылку на ваш e-mail"));
    } catch (error) {
      setMessage(error.message);
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
          <form className="registrationInput" onSubmit={handleSubmit}>
            <label htmlFor="email">{t("pleaseWriteUsername")}</label>
            <input
              type="username"
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
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Renewal;
