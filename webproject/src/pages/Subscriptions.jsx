import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Navdash from "./Navdash";
import Loader from "./Loader";
import { fetchUserData } from "../utils/apiService";
import { useTranslation } from "react-i18next";

const Subscriptions = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const [userData] = await Promise.all([fetchUserData(childId)]);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rtrat">
      <Sidebar />
      <div className="centralLessons">
        <div style={{ width: "fit-content" }}>
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
          />
        </div>
        <div className="subscriptionBanners">
          <div className="certbanner" style={{ width: "500px" }}>
            <h2
              className="defaultStyle"
              style={{
                fontSize: "xx-large",
                fontWeight: "800",
                color: "white",
                textAlign: "center",
                textWrap: "wrap",
              }}
            >
              {t("premiumPlans")}
            </h2>
          </div>
          <div className="subBanners">
            <div className="subBanner subban-1">
              <div className="subBanner-content">
                <p className="submonth">6 {t("months")}</p>
                <span>
                  <strong
                    style={{
                      margin: "0",
                      fontSize: "xx-large",
                      fontWeight: "900",
                    }}
                  >
                    9 990
                  </strong>{" "}
                  тг
                </span>
                <p
                  style={{
                    width: "250px",
                    textAlign: "center",
                    color: "#444",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  {t("standardForStart")}
                </p>
                <button
                  style={{
                    backgroundColor: "#F8753D",
                    fontWeight: "550",
                    fontSize: "large",
                    borderColor: "#FFB99C",
                    boxShadow: "none",
                  }}
                >
                  {t("choose")}
                </button>
              </div>
            </div>
            <div className="subBanner subban-2">
              <div className="subBanner-content">
                <p className="submonth">12 {t("months")}</p>
                <span>
                  <strong
                    style={{
                      margin: "0",
                      fontSize: "xx-large",
                      fontWeight: "900",
                    }}
                  >
                    15 990
                  </strong>{" "}
                  тг
                </span>
                <p
                  style={{
                    margin: "0",
                    width: "250px",
                    textAlign: "center",
                    color: "#444",
                    fontWeight: "500",
                  }}
                >
                  {t("standardForStart")}
                </p>
                <button
                  style={{
                    backgroundColor: "#F8753D",
                    fontWeight: "550",
                    fontSize: "large",
                    borderColor: "#FFB99C",
                    boxShadow: "none",
                  }}
                >
                  {t("choose")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
