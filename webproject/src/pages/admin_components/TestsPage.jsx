import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../../tailwind.css"; // Import Tailwind CSS
import Superside from "./Superside";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import TestCreationModal from "./tests/TestCreationModal";
import { fetchTests, removeTestFromCategory } from "../../utils/apiService";
import Loader from "../Loader";
import TestsListModal from "./tests/TestsListModal";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

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
        if (searchParams && searchParams.get("type")) {
            setType(searchParams.get("type"));
        }
        if (searchParams && searchParams.get("category")) {
            setCategoryId(searchParams.get("category"));
        }
    }, [searchParams]);

    const navigate = useNavigate();

    const [testData, setTestData] = useState({ id: -1 });
    const [testLoading, setTestLoading] = useState();
    const [mode, setMode] = useState(null);

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

    const loadTests = async () => {
        if (!type || !categoryId) {
            console.log("Type or categoryId is not set, skipping loadTests.");
            return;
        }
        setLoading(true);
        console.log("Loading tests for type:", type, "and categoryId:", categoryId);
        const data = await fetchTests(type, categoryId);
        console.log("Tests loaded:", data);
        setTests(data);
        setLoading(false);
        if (data.length === 0) {
            toast.info("Нет тестов в этой категории.");
        }
        if (data.length > 0) {
            toast.success("Тесты успешно загружены!");
        }
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

    const updateTestList = (tests) => {
        setTestList(tests);
    };

    const handleRemoveFromCategory = async (testId) => {
        if (!categoryId) return;
        try {
            await removeTestFromCategory(testId, categoryId);
            setTests(tests.filter((test) => test.id !== testId));
            toast.success("Тест успешно убран из категории!");
        } catch (error) {
            console.error("Error removing test from category:", error);
            toast.error("Не удалось убрать тест из категории. Пожалуйста, попробуйте позже.");
        }
    };



    useEffect(() => {
        loadTests();
    }, [type, categoryId]);

    const handleTestCreate = async () => {
        if (newTest.title.trim() === "") return alert("Test title cannot be empty!");
        await createTest(newTest);
        setTests([...tests, { ...newTest, id: Date.now(), test_type: "modo" }]);
        setNewTest({ title: "", description: "" });
        setIsModalOpen(false); // Close modal after creating test
    };

    if (loading) {
        return <Loader />;
    }

    let filteredTests = [...tests];

    async function openTest(testId) {
        setTestLoading(true);
        setIsModalOpen(true);
        const currentTest = tests.filter((test) => test.id == testId)[0];
        setTestData(currentTest);
        setMode("update");
    }

    function handleClose() {
        setIsModalOpen(false);
    }

    function testCreationButton() {
        setIsModalOpen(true);
        setMode("creation");
        setTestData({ id: -1 });
    }

    return (
        <div className="spdash">
            <Superside />
            <div className="superMain">
                <Link to={"/login"}>
                    <Button variant="outlined" style={{ float: "right" }}>
                        Выйти
                    </Button>
                </Link>

                <Typography variant="h5" style={{ fontWeight: "500", color: "#666", marginBottom: "20px" }}>
                    Мои тесты
                </Typography>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Link to={"/admindashboard/test-categories"}>
                        <Button variant="contained">Назад</Button>
                    </Link>
                    <Button variant="contained" color="success" onClick={loadTests}>
                        Обновить
                    </Button>
                    <Button variant="contained" color="warning" onClick={openTestListModal}>
                        Добавить существующий тест
                    </Button>
                    <Button variant="contained" onClick={testCreationButton}>
                        Создать тест
                    </Button>
                </div>
                <Typography variant="body1" style={{ marginBottom: "20px", color: "#666" }}>
                    Тип тестов: {formatType(type)}
                </Typography>
                <Grid container spacing={2}>
                    {filteredTests.length > 0 &&
                        filteredTests.map((test) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={test.id}>
                                <Card style={{ cursor: "pointer", height: "100%" }}>
                                    <CardContent style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                        <Typography variant="h6" style={{ color: "black" }}>
                                            {test.title}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: "#666", flexGrow: 1 }}>
                                            Описание: {test.description}
                                        </Typography>
                                        <Button
                                            onClick={() => openTest(test.id)}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            style={{ marginTop: '8px' }}
                                        >
                                            Открыть тест
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            style={{ marginTop: '8px' }}
                                            onClick={() => {
                                                handleRemoveFromCategory(test.id);
                                            }}
                                        >
                                            Убрать из категории
                                        </Button>
                                        <br />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
                {isModalOpen && <TestCreationModal mode={mode} testData={testData} onClose={handleClose} />}
                {isTestListModalOpen && (
                    <TestsListModal
                        onClose={closeTestListModal}
                        tests={testList}
                        categoryId={categoryId}
                        type={type}
                        updateTestList={updateTestList}
                        formatType={formatType}
                    />
                )}
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default TestsPage;
