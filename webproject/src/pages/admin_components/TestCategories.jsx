import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS
import Superside from "./Superside";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import TestCreationModal from "./tests/TestCreationModal";
import { fetchTestCategories, fetchTests } from "../../utils/apiService";
import Loader from "../Loader";
import { ToastContainer, toast } from "react-toastify";
import TestCategoryCreationOrUpdateModal from "./tests/TestCategoryCreationModal";
import { Pen } from "lucide-react";

const createTest = async (test) => console.log("Test Created:", test);
const featuredTypes = ["modo", "ent", "diagnostic", "pisa"];

const TestCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState("modo");
    const [language, setLanguage] = useState("");
    useEffect(() => {
        if (searchParams && searchParams.get('type')) {
            setType(searchParams.get('type'));
        }
    }, [searchParams]);

    const navigate = useNavigate();


    const handleUpdateClick = (category) => {
        setSelectedCategory(category); // Set the category to update
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null); // Reset the selected category
    };

    const loadTestCategories = async () => {
        try {
            const data = await fetchTestCategories();
            console.log("Test categories loaded:", data);
            setCategories(data);
            setLoading(false);
            toast.success("Категории тестов успешно загружены!");
        } catch (error) {
            console.error("Ошибка при загрузке категорий тестов:", error);
            setLoading(false);
            toast.error("Не удалось загрузить категории тестов. Пожалуйста, попробуйте позже.");
        }
    };

    useEffect(() => {
        loadTestCategories();
    }, []);

    if (loading) {
        return (
            <Loader />
        );
    }

    let filteredTestCategories = [...categories];

    if (type && featuredTypes.includes(type)) {
        filteredTestCategories = filteredTestCategories.filter(test => test.test_type == type)
    } else if (type) {
        filteredTestCategories = filteredTestCategories.filter(test => !featuredTypes.includes(test.test_type))
    }

    if (language) {
        filteredTestCategories = filteredTestCategories.filter(test => test.language?.toLowerCase() === language.toLowerCase());
    }

    let mandatoryCategories = filteredTestCategories.filter(category => category.is_mandatory);
    let profileCategories = filteredTestCategories.filter(category => category.is_profile && !category.is_mandatory);



    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if (lang) {
                params.set("lang", lang);
            } else {
                params.delete("lang");
            }
            return params;
        });
    };


    const openTestCategory = async (id) => {
        navigate(`/admindashboard/tests?category=${id}&type=${type}`);
    }

    return (
        <div className="spdash">
            <Superside />
            <div className="superMain">
                <Link to={"/login"}>
                    <button
                        style={{
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "transparent",
                            color: "#444",
                            fontSize: "large",
                            float: "right",
                        }}
                    >
                        Выйти
                    </button>
                </Link>

                <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
                    Мои предметы
                </p>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <ul style={{ display: "flex", gap: 8, fontSize: "20px" }}>
                        <li style={{ backgroundColor: type == "modo" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=modo">Модо</NavLink></li>
                        <li style={{ backgroundColor: type == "ent" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=ent">Ент</NavLink></li>
                        <li style={{ backgroundColor: type == "diagnostic" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=diagnostic">Диагностический тест</NavLink></li>
                        <li style={{ backgroundColor: type == "pisa" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=pisa">Pisa</NavLink></li>
                        <li style={{ backgroundColor: type == "others" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=others">Другие</NavLink></li>
                    </ul>
                    <select value={language} onChange={handleLanguageChange}>
                        <option value="">Все языки</option>
                        <option value="ru">Русский</option>
                        <option value="kz">Казахский</option>
                        <option value="en">Английский</option>
                    </select>
                    <button onClick={loadTestCategories}>
                        Обновить
                    </button>
                    <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: "#077AC2", color: "white", padding: "10px 20px", borderRadius: "5px" }}>
                        Создать предмет
                    </button>
                </div>
                <h2>Обязательные предметы</h2>
                <div className="superCont" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {mandatoryCategories.length > 0 && mandatoryCategories.map(category => (
                        <div key={category.id} className="addedCourses" style={{
                            width: "18%", cursor: "pointer", backgroundImage: `url(${category.image || "https://t4.ftcdn.net/jpg/02/82/19/53/360_F_282195356_Qnba54RyXAWkuEU2BYgIrBNTWIO3pzL5.jpg"})`, backgroundSize: "cover",
                            backgroundPosition: "center",
                        }} onClick={() => openTestCategory(category.id)}>
                            <button
                                style={{
                                    // backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering parent click event
                                    handleUpdateClick(category);
                                }}
                            >
                                <Pen color="white" size={16} />
                            </button>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "1rem",
                                }}
                            >
                            </div>
                            <div style={{
                                backgroundColor: "#077AC2",
                                fontSize: "0.8rem",
                                width: "80%",
                                textAlign: "center",
                                color: "white",
                                borderRadius: "10px",
                            }}>
                                <p>
                                    {category.name}
                                </p>

                            </div>

                        </div>
                    ))}
                </div>
                <h2>Профильные предметы</h2>
                <div className="superCont" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {profileCategories.length > 0 && profileCategories.map(category => (
                        <div key={category.id} className="addedCourses" style={{
                            width: "18%", cursor: "pointer", backgroundImage: `url(${category.image || "https://t4.ftcdn.net/jpg/02/82/19/53/360_F_282195356_Qnba54RyXAWkuEU2BYgIrBNTWIO3pzL5.jpg"})`, backgroundSize: "cover",
                            backgroundPosition: "center",
                        }} onClick={() => openTestCategory(category.id)}>
                            <button
                                style={{
                                    // backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering parent click event
                                    handleUpdateClick(category);
                                }}
                            >
                                <Pen color="white" size={16} />
                            </button>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "1rem",
                                }}
                            >
                            </div>
                            <div style={{
                                backgroundColor: "#077AC2",
                                fontSize: "0.8rem",
                                width: "80%",
                                textAlign: "center",
                                color: "white",
                                borderRadius: "10px",
                            }}>
                                <p>
                                    {category.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && <TestCategoryCreationOrUpdateModal
                    onClose={handleCloseModal}
                    categoryData={selectedCategory}  // Pass category data for update
                    isUpdate={!!selectedCategory}   // Set to true if it's update
                    onSuccess={loadTestCategories}  // Refresh the category list after update
                />}
            </div>
            <ToastContainer />
        </div >
    );
};

export default TestCategories;
