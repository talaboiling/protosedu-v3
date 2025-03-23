import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import cupicon from "../../assets/navCups.webp";
import League from "./League";
import tempRating from "../../assets/tempMainRating.webp";
import placeholderPfp from "../../assets/placehoder_pfp.webp"; // Import the placeholder image
import Ratinglist from "./Ratinglist"; // Import the Ratinglist component
import Loader from "../Loader";
import { fetchRatings, fetchTests, fetchUserData } from "../../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";

const featuredTypes = ["modo", "ent"];

const TestsChild = () => {

    const { t } = useTranslation();
    const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
    const [loading, setLoading] = useState(true); // Add loading state
    const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileSwitched, setIsProfileSwitched] = useState(false);
    const [checked, setChecked] = useState(i18next.language === "ru");
    const [type, setType] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tests, setTests] = useState([]);

    const navigate = useNavigate();
    
    useEffect(()=>{
      if (searchParams && searchParams.has('type')){
        setType(searchParams.get('type'));
      }
    }, [searchParams])

    function navigateToTest(testId){
      navigate(`${testId}`);
    }

    useEffect(() => {
        const fetchData = async () => {
          const childId = localStorage.getItem("child_id");
          try {
            console.log("childId", childId);
            const userData = await fetchUserData(childId);
            const testsData = await fetchTests();
            setUser(userData);
            setTests(testsData);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    console.log(tests);
    let filteredTests = [...tests];

    if (type && featuredTypes.includes(type)){
        filteredTests = filteredTests.filter(test=>test.test_type==type)
    }else if (type){
        filteredTests = filteredTests.filter(test=>!featuredTypes.includes(test.test_type))
    }

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
        <h2>Тесты</h2>
        <div style={{width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
          <ul style={{display: "flex", gap: 8, fontSize: "20px"}}>
              <li style={{backgroundColor: type=="modo" ? "orange" : "", padding: "5px", borderRadius: "10px"  }}><NavLink to="?type=modo">Модо</NavLink></li>
              <li style={{backgroundColor: type=="ent" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=ent">Ент</NavLink></li>
              <li style={{backgroundColor: type=="others" ? "orange" : "", padding: "5px", borderRadius: "10px"  }}><NavLink to="?type=others">Другие</NavLink></li>
          </ul>
        </div>
        <div style={{width: "80%", margin: "auto", display: "flex", gap: "2rem", flexWrap: "wrap"}}>
          {filteredTests.length>0 && filteredTests.map(test=>(
            <div key={test.id} className="addedCourses" style={{width: "200px", cursor: "pointer"}} onClick={()=>navigateToTest(test.id)}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <h3
                        className="defaultStyle"
                        style={{ fontSize: "x-large", color: "black" }}
                    >
                        {test.title}
                    </h3>
                    <p className="defaultStyle" style={{ color: "#666" }}>
                        {test.description}
                    </p>
                    <p className="defaultStyle" style={{ color: "#666" }}>
                        Test type: {capitalizeFirstLetter(test.test_type)}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestsChild