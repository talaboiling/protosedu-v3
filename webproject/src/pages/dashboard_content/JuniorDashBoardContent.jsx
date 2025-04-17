import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Navdash from '../Navdash'
import lionimg from "../../assets/lionDash.svg";
import mathIcon from "../../assets/calculator.webp";
import englishIcon from "../../assets/english.webp";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import SeniorMyGrowth from '../SeniorMyGrowth';
const JuniorDashBoardContent = ({data,options, user, isMenuOpen, courses, setIsMenuOpen, isProfileSwitched, setIsProfileSwitched, t}) => {
    const parentRef = useRef(null);
    const [graphWidth, setGraphWidth] = useState(0);
    
    useLayoutEffect(() => {
        if (parentRef.current) {
          const measuredWidth = parentRef.current.getBoundingClientRect().width * 0.8;
          setGraphWidth(measuredWidth);
        }
    }, []);
    
    console.log(graphWidth);
    return (
        <>
            <Navdash
                starCount={user.stars}
                cupCount={user.cups}
                gradeNum={user.grade}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isProfileSwitched={isProfileSwitched}
                setIsProfileSwitched={setIsProfileSwitched}
                urlPath={"dashboard"}
            />
            <div className="mainContent" ref={parentRef}>
                <h2 style={{ color: "#22222244" }}>{t("main")}</h2>
                <div className="helloContent">
                    <span className="helloCont">
                    <p
                        style={{
                        fontWeight: "500",
                        fontSize: "x-large",
                        color: "#222222ef",
                        margin: "0",
                        marginBottom: "15px",
                        }}
                    >
                        {t("hello")}, <strong>{user.first_name}</strong>
                    </p>
                    <p
                        style={{
                        fontWeight: "500",
                        color: "#2222229f",
                        maxWidth: "70%",
                        margin: "0",
                        }}
                    >
                        {t("quote1")}
                        {t("quote2")}
                    </p>
                    </span>
                    <img
                    src={lionimg}
                    alt="mascot"
                    style={{
                        position: "absolute",
                        top: "-50px",
                        left: "70%",
                        scale: "1.2",
                    }}
                    />
                </div>

                <h3
                    style={{ color: "black", fontWeight: "700", fontSize: "x-large", margin:0 }}
                >
                    {t("myCourses")}
                </h3>
                <div className="coursesCards">
                    {courses.map((course, section) => (
                    <div className="courseItem" key={course.id}>
                        <div className="courseItemLeft">
                        <p style={{ margin: "0" }}>{course.name}</p>
                        <progress value={course.percentage_completed / 100} />
                        <Link to={`/dashboard/courses/${course.id}/sections`}>
                            <button
                            style={{
                                backgroundColor: "#F8753D",
                                fontWeight: "550",
                                fontSize: "medium",
                                borderColor: "#FFB99C",
                                boxShadow: "none",
                            }}
                            >
                            {t("begin")}
                            </button>
                        </Link>
                        </div>
                        <img
                        src={course.name === "Математика" ? mathIcon : englishIcon}
                        alt={course.name}
                        className="courseImage"
                        style={{
                            backgroundColor: "#F8753D",
                            border: "1px solid black",
                            borderRadius: "21px",
                        }}
                        />
                    </div>
                    ))}
                </div>
                <div className="progressChart">
                    <SeniorMyGrowth t={t} graphStyles={{height: "250px", width: graphWidth ? `${graphWidth}px` : "200px"}}/>
                </div>
            </div>
        </>
    )
}

export default JuniorDashBoardContent