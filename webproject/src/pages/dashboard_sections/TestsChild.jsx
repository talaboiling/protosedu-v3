import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import cupicon from "../../assets/navCups.webp";
import League from "./League";
import tempRating from "../../assets/tempMainRating.webp";
import placeholderPfp from "../../assets/placehoder_pfp.webp"; // Import the placeholder image
import Ratinglist from "./Ratinglist"; // Import the Ratinglist component
import Loader from "../Loader";
import {
  fetchRatings,
  fetchTests,
  fetchUserData,
} from "../../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import TestsTable from "./TestsTable";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

const featuredTypes = ["modo", "ent", "diagnostic", "pisa"];

const TestsChild = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
  const [loading, setLoading] = useState(true); // Add loading state
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSwitched, setIsProfileSwitched] = useState(false);
  const [checked, setChecked] = useState(i18next.language === "ru");
  const [type, setType] = useState();
  const [categoryId, setCategoryId] = useState(null);
  const [language, setLanguage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tests, setTests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams && searchParams.has("type")) {
      setType(searchParams.get("type").toLowerCase());
    }
    if (searchParams && searchParams.has("category")) {
      setCategoryId(searchParams.get("category").toLowerCase());
    }
    if (searchParams && searchParams.has("lang")) {
      setLanguage(searchParams.get("lang").toLowerCase());
    }
  }, [searchParams]);

  function navigateToTest(testId) {
    navigate(`${testId}`);
  }

  const formatType = (type) => {
    switch (type) {
      case 'modo':
        return 'МОДО';
      case 'ent':
        return 'ЕНТ';
      case 'diagnostic':
        return 'Диагностический';
      case 'pisa':
        return 'PISA';
      default:
        return 'Неизвестный тип';
    }
  };

  useEffect(() => {
    const fetchUserAndTests = async (childId) => {
      try {
        console.log("childId", childId);
        const userData = await fetchUserData(childId);
        setUser(userData);

        if (!categoryId) {
          setLoading(false);
          return;
        }

        const testsData = await fetchTests(type, categoryId);
        setTests(testsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      if (!childId) {
        console.error("No child_id found in localStorage");
        setLoading(false);
        return;
      }
      await fetchUserAndTests(childId);
    };

    fetchData();
  }, [categoryId, type]);

  console.log(tests);
  let filteredTests = [...tests];

  console.log(type);

  if (type && featuredTypes.includes(type)) {
    filteredTests = filteredTests.filter((test) => test.test_type == type);
  } else if (type) {
    filteredTests = filteredTests.filter(
      (test) => !featuredTypes.includes(test.test_type)
    );
  };

  console.log(filteredTests);

  return (
    <div className="rtrat ratingPage">
      <div className="centralLessons">
        <div style={{ width: "100%" }}>
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
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
          Тесты {formatType(type)}
        </h2>
        <Link
          to={`/dashboard/test-categories?type=${type}&language=${language}`}
          style={{ textDecoration: "none" }} // To remove the underline from the link
        >
          <Button variant="contained" color="primary" style={{ fontSize: "1rem", padding: "10px 20px" }}>
            Назад
          </Button>
        </Link>
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {filteredTests.length > 0 &&
            filteredTests.map((test) => (
              <Grid item xs={12} sm={6} md={4} key={test.id}>
                <Card
                  onClick={() => navigateToTest(test.id)}
                  style={{
                    cursor: "pointer",
                    padding: "20px",
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      {test.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{
                        textAlign: "center",
                        fontSize: "1rem",
                      }}
                    >
                      {test.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default TestsChild;
