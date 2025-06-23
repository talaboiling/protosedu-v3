import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Superside from "./Superside";

async function fetchTest(){

}

const TestPage = () => {
    const {testId} = useParams();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        async function getTest(){
            try {
                setLoading(true);
                const data = await getTest(testId);
                setTestData(data);
            }catch(e){
                toast.error(e.message || "Error happened");
            }finally{
                setLoading(false);
            }
        }
        getTest();
    }, [testId]);

    return (
        <>
            {loading && (
                <div>Loading...</div>
            )}
            {!loading && (
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
                
                        
                        <div className="superCont" style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}>

                        </div>
                        
                    </div>
                </div>
            )}
        </>
    )
}

export default TestPage