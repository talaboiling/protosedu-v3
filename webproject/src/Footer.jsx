import logo from "./assets/NAV_LOGO.webp";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
function Footer() {
  const { t } = useTranslation();
  return (
    <footer id="contakty">
      <div className="footer">
        <div>
          <img src={logo} alt="logo" style={{maxWidth:"200px"}} />
          <p style={{ color: "white" }}>
            &copy; {new Date().getFullYear()} Vunderkids
          </p>
        </div>
        <p className="rev" style={{ color: "white" }}>
          {t("ourContacts")}: +7 775 303 7432
        </p>
        <div className="footerDocs">
          <Link to="/oferty">
            <p>{t("oferta")}</p>
          </Link>
          <Link to="/users-terms-and-conditions">
            <p>{t("tac")}</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
