import icon_games from "./assets/icon_games.webp";
import icon_books from "./assets/icon_books.webp";
import icon_cert from "./assets/icon_cert.webp";
import icon_tablet from "./assets/icon_tablet.webp";
import img_laptop from "./assets/img_laptop.webp";
import icon_stars from "./assets/stars_decor.webp";
import laptops from "./assets/laptops_img.webp";
import tablet from "./assets/tablet_img.webp";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Offers from "./Offers.jsx";
import OffersBot from "./OffersBot.jsx";
import background from "./assets/pngwing.webp";
import icon_grad from "./assets/icon_grad.webp";
import icon_school from "./assets/icon_school.webp";
import offer_books from "./assets/offer_books.webp";
import offer_certificate from "./assets/offer_certificate.webp";
import offer_gaming from "./assets/offer_gaming.webp";
import offer_tablet from "./assets/offer_tablet.webp";
import offer_progress from "./assets/offer_progress.webp";
import offer_time from "./assets/offer_time.webp";
import logoImg from "./assets/logo_blue.webp";
import logoFuture from "./assets/futureschool.png";
import logo_65 from "./assets/65_logo.png";
import logo_83 from "./assets/83_logo.png"
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Contents() {
  useEffect(() => { }, []);
  const { t } = useTranslation();
  return (
    <>
      <div className="contents" id="oplatforme">
        <div className="beforeCont"></div>
        <div className="contLeft">
          <ul
            style={{
              listStyleType: "none",
              padding: 5,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            <li style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <img src={icon_games} alt="icon_games" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  padding: "0",
                  maxWidth: "150px",
                }}
              >
                <h3 style={{ margin: "0" }}>{t("videoGames")}</h3>
                <p style={{ fontWeight: "400", fontSize: "small" }}>
                  {t("videoGamesDescription")}
                </p>
              </div>
            </li>
            <li
              style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}
            >
              <img src={icon_books} alt="icon_books" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  padding: "0",
                  maxWidth: "150px",
                }}
              >
                <h3 style={{ margin: "0" }}>{t("motivatingTasks")}</h3>
                <p style={{ fontWeight: "400", fontSize: "small" }}>
                  {t("motivatingTasksDescription")}
                </p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <img src={icon_cert} alt="icon_certificate" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  padding: "0",
                  maxWidth: "150px",
                }}
              >
                <h3 style={{ margin: "0" }}>{t("certificates")}</h3>
                <p style={{ fontWeight: "400", fontSize: "small" }}>
                  {t("certificatesDescription")}
                </p>
              </div>
            </li>
            <li
              style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}
            >
              <img src={icon_tablet} alt="icon_tablet" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  padding: "0",
                  maxWidth: "150px",
                }}
              >
                <h3 style={{ margin: "0" }}>{t("variousThemes")}</h3>
                <p style={{ fontWeight: "400", fontSize: "small" }}>
                  {t("variousThemesDescription")}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="contRight">
          <img
            src={icon_stars}
            alt=""
            style={{ position: "absolute", marginLeft: "370px", width: "8%" }}
          />
          <motion.div
            className="titleAnim"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span><h2>{t('parentDepend1')}</h2></span>
            <span className='mob-none'><h2>{t('parentDepend2')}</h2></span>
            <span className='mob-display'><h2>{t('parentDepend2_mob')}</h2></span>
            <span className='mob-display'><h2>{t('parentDepend22_mob')}</h2></span>
            <span><h2>{t('parentDepend3')}</h2></span>
          </motion.div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={icon_stars}
              alt=""
              style={{
                position: "absolute",
                width: "6%",
                marginLeft: "-50px",
                marginTop: "-120px",
              }}
            />
            <div style={{ marginTop: "50px" }}>
              <div className="contDisplay">
                <h4>{t("motivatingTasks")}</h4>
              </div>
              <div className="contDisplay">
                <h4>{t("videoGames")}</h4>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "45%",
                marginTop: "22%",
                zIndex: "-1",
              }}
            >
              <img
                src={img_laptop}
                alt="img_laptop"
                style={{ width: "120%", height: "100%" }}
              />
            </div>
          </div>
          <Link to={"/registration"}>
            <button className="orangeButton" style={{ marginTop: "50px" }}>
              {t("try")}
            </button>
          </Link>

          <img
            src={icon_stars}
            alt=""
            style={{
              position: "absolute",
              marginLeft: "10px",
              marginTop: "70px",
              width: "4%",
            }}
          />
        </div>
      </div>
      <div className="hookUnder">
        <div className="hookInfo">
          <p style={{ fontWeight: "700", textAlign: "center", width: "250px" }}>
            {t("byStandard")}
          </p>
          <div className="hookInfoRight">
            <img src={icon_grad} alt="icon_graduation" className="glowImg" />
            <p style={{ marginLeft: "20px" }}>{t("students100k")}</p>
            <img src={icon_school} alt="icon_school" className="glowImg" />
            <p style={{ marginLeft: "20px" }}>{t("schools5k")}</p>
          </div>
        </div>
      </div>
      <div className="contPartners">
        <h1 className="partnerTitle" style={{ animation: "none", margin: "0", lineHeight: "normal" }}>{t("ourPartners")}</h1>
        <div className="partnerLogos" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
          <img src={logoFuture} alt="Future School Logo" style={{ width: "300px", height: "300px" }} />
          <img src={logo_65} alt="Future School Logo" style={{ width: "300px", height: "300px" }} />
          <img src={logo_83} alt="Future School Logo" style={{ width: "300px", height: "300px" }} />
        </div>
      </div>


      <div className="offers">
        <div className="offersTop">
          <Offers num={1} text={t("personalStudyProgram")} img={offer_books} />
          <Offers num={2} text={t("moreThanPractical")} img={offer_tablet} />
          <Offers num={3} text={t("progressMonitor")} img={offer_progress} />
        </div>
        <div className="offersBottom">
          <OffersBot
            num={4}
            text={t("interestingVideoGames")}
            img={offer_gaming}
          />
          <OffersBot num={5} text={t("anywhereAnytime")} img={offer_time} />
          <OffersBot
            num={6}
            text={t("endCertificate")}
            img={offer_certificate}
          />
        </div>
      </div>
      <div className="learnPlan" id="obuchenie">
        <div className="planLaptop">
          <img src={laptops} alt="" className="planImg" />
        </div>
        <div className="planTop">
          <h1 className='laptop-mob-none mob-none' style={{ lineHeight: "50px", width: "557px" }}>{t('mathPlan')}</h1>
          <h2 className='mob-display' style={{ lineHeight: "50px", width: "100%", fontSize: "35px" }}>{t('mathPlan')}</h2>
          <ul className="planCardBot">
            <li className="planCardList">{t("numeration")}</li>
            <li className="planCardList">{t("numCompare")}</li>
            <li className="planCardList">{t("arithmeticTasks")}</li>
            <li className="planCardList">{t("addSubtract")}</li>
            <li className="planCardList">{t("multDiv")}</li>
            <li className="planCardList">{t("logicalTasks")}</li>
            <li className="planCardList">{t("geometricalShapes")}</li>
          </ul>
        </div>
        <div className="planTop">
          <h1 className='laptop-mob-none mob-none' style={{ lineHeight: "50px", width: "577px" }}>{t('engPlan')}</h1>
          <h2 className='mob-display' style={{ lineHeight: "50px", width: "90%", fontSize: "35px" }}>{t('engPlan')}</h2>
          <ul className="planCardBot">
            <li className="planCardList">Phonics</li>
            <li className="planCardList">Grammar</li>
            <li className="planCardList">Nouns</li>
            <li className="planCardList">Verbs</li>
            <li className="planCardList">Adjectives</li>
            <li className="planCardList">Adverbs</li>
            <li className="planCardList">Building sentences</li>
          </ul>
        </div>
        <div className="planLaptop">
          <img src={tablet} alt="" className="planImg" style={{ top: "0px" }} />
        </div>
        <div className="planBack">
          <img
            src={background}
            alt=""
            style={{ width: "100%", marginTop: "100px", scale: "115%" }}
          />
        </div>
      </div>
      <div className="bottomCont">
        <div className="bottomCard">
          <img className='mob-none' src={logoImg} alt="logo" style={{ width: "136px", height: "34px" }} />
          <h1 className='mob-none'>{t('eduInvest1')}<br /><br /><br />{t('eduInvest2')}</h1>
          <span><h2 className='mob-display' style={{ width: "100%", lineHeight: "40px", fontSize: "35px" }}>{t('eduInvest3')}</h2></span>
          <ol style={{}}>
            <li>
              <div className="contDisplay">
                <h4>{t("completeLessons")}</h4>
              </div>
            </li>
            <li>
              <div className="contDisplay">
                <h4>{t("earnGoldCoins")}</h4>
              </div>
            </li>
            <li>
              <div className="contDisplay">
                <h4>{t("playVideoGames")}</h4>
              </div>
            </li>
            <li>
              <div className="contDisplay">
                <h4>{t("learnSkills")}</h4>
              </div>
            </li>
            <li>
              <div className="contDisplay">
                <h4>{t("getFeedback")}</h4>
              </div>
            </li>
          </ol>
          <Link to={"/registration"}>
            <button
              className="orangeButton"
              style={{ marginTop: "15px", fontSize: "xx-large" }}
            >
              {t("try")}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Contents;
