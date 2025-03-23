import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS
import Superside from "./Superside";
import { capitalizeFirstLetter } from "../../lib/helperFunctions";
import TestCreationModal from "./tests/TestCreationModal";
import { fetchTests } from "../../utils/apiService";

const createTest = async (test) => console.log("Test Created:", test);
const featuredTypes = ["modo", "ent"];

const TestsPage = () => {
    const [tests, setTests] = useState([]);
    const [newTest, setNewTest] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state

    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState(null);
    useEffect(()=>{
        if (searchParams && searchParams.get('type')){
            setType(searchParams.get('type'));
        }
    }, [searchParams]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadTests = async () => {
            const data = await fetchTests();
            setTests(data);
            setLoading(false);
        };
        loadTests();
    }, []);

    const handleTestCreate = async () => {
        if (newTest.title.trim() === "") return alert("Test title cannot be empty!");
        await createTest(newTest);
        setTests([...tests, { ...newTest, id: Date.now(), test_type: "modo" }]);
        setNewTest({ title: "", description: "" });
        setIsModalOpen(false);  // Close modal after creating test
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-gray-500 text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    console.log(tests);

    let filteredTests = [...tests];

    if (type && featuredTypes.includes(type)){
        filteredTests = filteredTests.filter(test=>test.test_type==type)
    }else if (type){
        filteredTests = filteredTests.filter(test=>!featuredTypes.includes(test.test_type))
    }

    function navigateToTest(testId){
        navigate(`${testId}`);
    }

    function handleClose(){
        setIsModalOpen(false);
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
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <ul style={{display: "flex", gap: 8, fontSize: "20px"}}>
                    <li style={{backgroundColor: type=="modo" ? "orange" : "", padding: "5px", borderRadius: "10px"  }}><NavLink to="?type=modo">Модо</NavLink></li>
                    <li style={{backgroundColor: type=="ent" ? "orange" : "", padding: "5px", borderRadius: "10px" }}><NavLink to="?type=ent">Ент</NavLink></li>
                    <li style={{backgroundColor: type=="others" ? "orange" : "", padding: "5px", borderRadius: "10px"  }}><NavLink to="?type=others">Другие</NavLink></li>
                </ul>
                <button onClick={()=>setIsModalOpen(true)}>
                    Создать тест
                </button>
            </div>
            <div className="superCont" style={{display: "flex", gap: "1rem"}}>
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
            {isModalOpen && <TestCreationModal onClose={handleClose}/>}
          </div>
    
        </div>
      );
};

export default TestsPage;
