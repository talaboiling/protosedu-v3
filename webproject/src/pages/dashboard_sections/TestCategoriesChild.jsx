import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchTestCategories } from "../../utils/apiService";
import Navdash from "../Navdash";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// Import MUI components for select
import { Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";

const featuredTypes = ["modo", "ent", "diagnostic", "pisa"];

const TestCategoriesChild = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(""); // For selected type
    const [language, setLanguage] = useState("kz"); // For selected language
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    // Load the category type and language from search params
    useEffect(() => {
        if (searchParams && searchParams.has("type")) {
            setType(searchParams.get("type").toLowerCase());
        }
        if (searchParams && searchParams.has("lang")) {
            setLanguage(searchParams.get("lang"));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await fetchTestCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter categories based on type and language
    let filteredCategories = [...categories];

    if (type && featuredTypes.includes(type)) {
        filteredCategories = filteredCategories.filter(
            (category) => category.test_type === type
        );
    } else if (type) {
        filteredCategories = filteredCategories.filter(
            (category) => !featuredTypes.includes(category.test_type)
        );
    }

    if (language) {
        filteredCategories = filteredCategories.filter(
            (category) => category.language?.toLowerCase() === language.toLowerCase()
        );
    }

    // Split categories into mandatory and profile categories
    const mandatoryCategories = filteredCategories.filter(
        (category) => category.is_mandatory
    );
    const profileCategories = filteredCategories.filter(
        (category) => category.is_profile && !category.is_mandatory
    );

    // Navigate to category's tests
    function navigateToCategory(categoryId, testType) {
        navigate(`/dashboard/tests?category=${categoryId}&type=${testType}&lang=${language || ""}`);
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

    // Handle Type Select Change
    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setType(selectedType);
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (selectedType) {
                params.set("type", selectedType);
            } else {
                params.delete("type");
            }
            return params;
        });
    };

    // Handle Language Select Change
    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (selectedLanguage) {
                params.set("lang", selectedLanguage);
            } else {
                params.delete("lang");
            }
            return params;
        });
    };

    return (
        <div className="rtdash rtrat ratingPage">
            <div className="centralLessons">
                <div style={{ width: "100%" }}>
                    <Navdash
                        starCount={user.stars}
                        cupCount={user.cups}
                        gradeNum={user.grade}
                        urlPath={"rating"}
                    />
                </div>

                <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "2rem",
                            fontSize: "2rem",
                            color: "#333",
                        }}
                    >
                        Категории тестов
                    </h2>

                    {/* Filter section */}
                    <Grid container spacing={2} justifyContent="center">
                        {/* <Grid item>
                            <FormControl variant="outlined" style={{ width: "150px" }}>
                                <InputLabel>Выберите тип</InputLabel>
                                <Select
                                    value={type || ""}
                                    onChange={handleTypeChange}
                                    label="Test Type"
                                >
                                    {featuredTypes.map((testType) => (
                                        <MenuItem key={testType} value={testType}>
                                            {formatType(testType)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item>
                            <FormControl variant="outlined" style={{ width: "150px" }}>
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={language || ""}
                                    onChange={handleLanguageChange}
                                    label="Language"
                                >
                                    <MenuItem value="ru">Русский</MenuItem>
                                    <MenuItem value="kz">Казахский</MenuItem>
                                    <MenuItem value="en">Английский</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Mandatory Categories Section */}
                            {mandatoryCategories.length > 0 && (
                                <div style={{ marginBottom: "3rem" }}>
                                    <h2
                                        style={{
                                            marginBottom: "1.5rem",
                                            fontSize: "1.5rem",
                                            color: "#077AC2",
                                            borderBottom: "2px solid #077AC2",
                                            paddingBottom: "0.5rem",
                                        }}
                                    >
                                        Обязательные предметы
                                    </h2>
                                    <div
                                        className="superCont"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                            gap: "1.5rem",
                                            marginBottom: "2rem",
                                        }}
                                    >
                                        {mandatoryCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="addedCourses"
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "25px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "12px",
                                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${category.image || "https://t4.ftcdn.net/jpg/02/82/19/53/360_F_282195356_Qnba54RyXAWkuEU2BYgIrBNTWIO3pzL5.jpg"})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    minHeight: "150px",
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                }}
                                                onClick={() =>
                                                    navigateToCategory(category.id, category.test_type)
                                                }
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: "rgba(7, 122, 194, 0.9)",
                                                        fontSize: "1rem",
                                                        width: "100%",
                                                        textAlign: "center",
                                                        color: "white",
                                                        borderRadius: "8px",
                                                        fontWeight: "500",
                                                        marginTop: "auto",
                                                    }}
                                                >
                                                    <p style={{ fontSize: "12px" }}>{category.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Profile Categories Section */}
                            {profileCategories.length > 0 && (
                                <div>
                                    <h2
                                        style={{
                                            marginBottom: "1.5rem",
                                            fontSize: "1.5rem",
                                            color: "#077AC2",
                                            borderBottom: "2px solid #077AC2",
                                            paddingBottom: "0.5rem",
                                        }}
                                    >
                                        Профильные предметы
                                    </h2>
                                    <div
                                        className="superCont"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                            gap: "1.5rem",
                                        }}
                                    >
                                        {profileCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="addedCourses"
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "25px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "12px",
                                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${category.image || "https://t4.ftcdn.net/jpg/02/82/19/53/360_F_282195356_Qnba54RyXAWkuEU2BYgIrBNTWIO3pzL5.jpg"})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    minHeight: "150px",
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                }}
                                                onClick={() =>
                                                    navigateToCategory(category.id, category.test_type)
                                                }
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: "rgba(7, 122, 194, 0.9)",
                                                        fontSize: "1rem",
                                                        width: "100%",
                                                        textAlign: "center",
                                                        color: "white",
                                                        borderRadius: "8px",
                                                        fontWeight: "500",
                                                        marginTop: "auto",
                                                    }}
                                                >
                                                    <p style={{ fontSize: "12px" }}>{category.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No categories message */}
                            {mandatoryCategories.length === 0 && profileCategories.length === 0 && (
                                <div style={{ textAlign: "center", padding: "3rem" }}>
                                    <p style={{ fontSize: "1.2rem", color: "#666" }}>
                                        Нет доступных категорий.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestCategoriesChild;
