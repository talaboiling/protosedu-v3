import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../../sidebar/Sidebar";
import Navdash from "../../Navdash";
import placeholderPfp from "../../../assets/placehoder_pfp.webp"; // Import the placeholder image
import Loader from "../../Loader";
import { fetchRatings, fetchTest, fetchTests, fetchUserData } from "../../../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../lib/helperFunctions";
import Quiz from "./Quiz";
import Modal from "../../../helpers/Modal";
import HPBs_Form from "./HPBs_Form";
import PreviousAttemptsList from "../PreviousAttemptsList";

const featuredTypes = ["modo", "ent"];

const TestChild = () => {

  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [loading, setLoading] = useState(false); // Add loading state
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [checked, setChecked] = useState(i18next.language === "ru");

  const [test, setTest] = useState(null);
  const { testId } = useParams();
  const [isFinished, setIsFinished] = useState(false);

  const navigate = useNavigate();

  console.log("EEEEE")
  console.log(testId);

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        setLoading(true);
        console.log("childId", childId);
        const userData = await fetchUserData(childId);
        const testData = await fetchTest(testId);
        setUser(userData);
        setTest(testData);
        if (testData.is_finished) {
          setIsFinished(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [testId]);

  console.log(test);

  return (
    <div className="rtdash rtrat ratingPage">
      <Sidebar isMenuOpen={isMenuOpen} />
      <div className="centralLessons">
        <div style={{ width: "fit-content" }}>
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isProfileSwitched={isProfileSwitched}
            setIsProfileSwitched={setIsProfileSwitched}
            urlPath={"rating"}
          />
        </div>
        {test && (
          <div>
            <h2>{test.title}</h2>
            <p>{test.description}</p>
            <hr style={{ width: "90%", float: "left" }} />
            <hr style={{ width: "100%", backgroundColor: "transparent", border: "none" }} />
            <Quiz questions={test.questions} />
          </div>
        )}
        {isFinished && <Modal onClose={() => setIsFinished(false)}>
          <HPBs_Form
            header="Вы уже прошли этот тест!"
            paragraph="Вы можете пройти этот тест еще раз, но это не даст вам дополнительных баллов."
            buttons={[
              {
                onClick: () => navigate("/dashboard/tests"),
                label: "Посмотреть другие тесты"
              },
              {
                onClick: () => setIsFinished(false),
                label: "Пройти снова",
                styles: {
                  backgroundColor: "grey"
                }
              }
            ]}
            additionalContent={
              <PreviousAttemptsList previousAttemps={test.test_results} testId={testId} />
            }
          />
        </Modal>}
      </div>
    </div>
  );
}

export default TestChild