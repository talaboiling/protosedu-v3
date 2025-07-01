import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS
import Superside from "./Superside";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import TestCreationModal from "./tests/TestCreationModal";
import { fetchTests } from "../../utils/apiService";
import Loader from "../Loader";
import { set } from "react-hook-form";
import TestsListModal from "./tests/TestsListModal";

const createTest = async (test) => console.log("Test Created:", test);
const featuredTypes = ["modo", "ent", "diagnostic", "pisa"];

const TestsPage = () => {
    const [tests, setTests] = useState([]);
    const [testList, setTestList] = useState([]);
    const [newTest, setNewTest] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTestListModalOpen, setIsTestListModalOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    useEffect(() => {
        if (searchParams && searchParams.get('type')) {
            setType(searchParams.get('type'));
        }
        if (searchParams && searchParams.get('category')) {
            setCategoryId(searchParams.get('category'));
        }
    }, [searchParams]);

    const navigate = useNavigate();

    const [testData, setTestData] = useState({ id: -1 });
    const [testLoading, setTestLoading] = useState();
    const [mode, setMode] = useState(null);

    const loadTests = async () => {
        console.log("Loading tests for type:", type, "and categoryId:", categoryId);
        const data = await fetchTests(type, categoryId);
        setTests(data);
        setLoading(false);
    };

    const loadAllTests = async () => {
        if (!type || !categoryId) return;
        console.log("Loading all tests...");
        const data = await fetchTests(type);
        console.log("All tests loaded:", data);
        setTestList(data);
    };

    const openTestListModal = () => {
        setIsTestListModalOpen(true);
        loadAllTests();
    };

    const closeTestListModal = () => {
        setIsTestListModalOpen(false);
        loadTests();
    };

    useEffect(() => {
        loadTests();
    }, [type, categoryId]);

    const handleTestCreate = async () => {
        if (newTest.title.trim() === "") return alert("Test title cannot be empty!");
        await createTest(newTest);
        setTests([...tests, { ...newTest, id: Date.now(), test_type: "modo" }]);
        setNewTest({ title: "", description: "" });
        setIsModalOpen(false);  // Close modal after creating test
    };

    if (loading) {
        return (
            <Loader />
        );
    }


    let filteredTests = [...tests];

    async function openTest(testId) {
        setTestLoading(true);
        setIsModalOpen(true);
        const currentTest = tests.filter(test => test.id == testId)[0];
        setTestData(currentTest);
        setMode("update");
    }


    function handleClose() {
        setIsModalOpen(false);
    }

    function testCreationButton() {
        setIsModalOpen(true);
        setMode("creation");
        testData({ id: -1 });
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
                    Мои тесты
                </p>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Link to={"/admindashboard/test-categories"}>
                        <button>
                            Назад
                        </button>
                    </Link>
                    <button style={{ backgroundColor: "orange", borderRadius: "4px" }} onClick={() => {
                        openTestListModal();
                    }}>
                        Добавить существующий тест
                    </button>
                    <button onClick={testCreationButton}>
                        Создать тест
                    </button>
                </div>
                <div className="superCont" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {filteredTests.length > 0 && filteredTests.map(test => (
                        <div key={test.id} className="addedCourses" style={{ width: "18%", cursor: "pointer" }} onClick={() => openTest(test.id)}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "1rem"
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
                {isModalOpen && <TestCreationModal mode={mode} testData={testData} onClose={handleClose} />}
                {isTestListModalOpen && (
                    <TestsListModal
                        onClose={closeTestListModal}
                        tests={testList}
                        categoryId={categoryId}
                        type={type} />
                )}
            </div>
        </div>
    );
};

export default TestsPage;
