import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import placeholderPfp from "../../assets/placehoder_pfp.webp"; // Import the placeholder image
import { useTranslation } from "react-i18next";
import streak from "../../assets/streak.webp";
import nostreak from "../../assets/nostreak.webp";
import goldmedal from "../../assets/gold.svg";
import silvermedal from "../../assets/silver.svg";
import bronzemedal from "../../assets/bronze.svg";
import {
  fetchUserData,
} from "../../utils/apiService";

const Ratinglist = ({ ratings }) => {
  const [user, setUser] = useState({ first_name: "Student", last_name: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const userData = await fetchUserData(childId);
        console.log("userData", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="ratingList">
      <p
        style={{
          fontSize: "x-large",
          fontWeight: "650",
          color: "#222222",
          margin: "0",
          padding: "0",
          marginBottom: "15px",
        }}
      >
        {t("studentRating")}
      </p>
      <div className="studentsList">
        {ratings.map((student, index) => (
          <div
            className="ratingItem"
            key={student.id}
            style={{
              backgroundColor:
                index === 0
                  ? "#FFD700"
                  : index === 1
                  ? "#97D4E7"
                  : index === 2
                  ? "#D9AB7D"
                  : "#F0F7FF",
              maxHeight: user.grade>2 ? "40px" : "inherit"
            }}
          >
            <div className="notMedals">
              <img
                src={student.avatar || placeholderPfp}
                alt="pfp"
                className="pfprating"
                style={{ borderRadius: "50%", width: user.grade <= 2 ? "50px" : "40px", height: user.grade <= 2 ? "50px" : "40px" }}
              />
              <div className="namePoints">
                <p
                  style={{
                    fontSize: user.grade<=2 ? "large" : 'medium',
                    color: index > 2 ? "#222222" : "#fff",
                    margin: "0",
                    padding: "0",
                    fontWeight: "600",
                    width: "120px",
                    whiteSpace: "nowrap",    
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {student.first_name} {student.last_name}
                </p>
                <p
                  style={{
                    fontSize: user.grade<=2 ? "large" : 'small',
                    color: index > 2 ? "#222222" : "#fff",
                    margin: "0",
                    padding: "0",
                    fontWeight: "700",
                  }}
                >
                  <strong style={{ fontSize: user.grade<=2 ? "large" : 'small', fontWeight: 700 }}>{student.cups}</strong>{" "}
                  {t("points")}
                </p>
                {user.grade<=2 && <span
                  style={{
                    margin: "0",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{ margin: "0", color: index > 2 ? "#222222" : "#fff" }}
                  >
                    {student.streak}
                  </p>
                  <img
                    src={student.streak !== 0 ? streak : nostreak}
                    alt=""
                    style={{ width: "20px", height: "20px", marginRight: "5px" }}
                  />
                </span>}
              </div>
            </div>
            
            <div className="medals">
              {index === 0 && (
                <>
                  <img src={goldmedal} alt="gold" />
                  {/* <img src={silvermedal} alt="silver" />
                  <img src={bronzemedal} alt="bronze" /> */}
                </>
              )}
              {index === 1 && (
                <>
                  <img src={silvermedal} alt="silver"/>
                  {/* <img src={bronzemedal} alt="bronze" /> */}
                </>
              )}
              {index === 2 && (
                <>
                  <img src={bronzemedal} alt="bronze" />
                </>
              )}
              {index > 2 && (
                <p
                  style={{
                    fontSize: user.grade<=2 ? "40px" : '32px',
                    fontWeight: "800",
                    color: "#55A2FA",
                    margin: "0",
                    padding: "0",
                  }}
                >
                  {index + 1}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Ratinglist.propTypes = {
  ratings: PropTypes.array,
};

Ratinglist.defaultProps = {
  ratings: [],
};

export default Ratinglist;
