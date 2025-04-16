import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import logo from "../../assets/NAV_LOGO.webp";
import { useTranslation } from "react-i18next";
import classes from "./style.module.css"

const JuniorSidebar = ({user, isMenuOpen, goBack, handleLogout}) => {
    const { t } = useTranslation();
    return (
        <div className={`sidebar  ${classes["sidebar-junior"]} ${isMenuOpen ? "activeMenu" : ""}`} style={{backgroundColor: user.grade<4 ? "#97D4E7" : ""}}>
        <Link to={"/"}>
            <img src={logo} alt="logo" className="dashsidelogo" />
        </Link>

        <div className="excSideLogo">
            <ul className="sideItems">
            {SidebarData.map((item, index) => {
                const isActive = location.pathname === item.link;
                const activeColor = isActive ? '#007599' : 'white';
                const newIcon = React.cloneElement(item.icon, 
                    item.icon.props.sx 
                        ? { 
                            sx: { 
                            ...item.icon.props.sx, 
                            color: activeColor 
                            } 
                        }
                        : { color: activeColor }
                );
                return <li
                    key={index}
                    className="linkbuttons"
                    id={window.location.pathname === item.link ? "active" : ""}
                    onClick={() => {
                        window.location.pathname = item.link;
                }}
                >
                <NavLink to={item.link} className={`${classes["linkbuttonVal"]}`} style={{textDecoration: "none"}}>
                    {newIcon}
                    <span className="linkTitle" style={{color: activeColor}}>
                        {item.title}
                    </span>
                </NavLink>
                </li>
            })}
            </ul>
            {/* Conditionally render the "Назад" button based on user role */}
            {user.role === "parent" && (
            <button className="exitButton" onClick={goBack}>
                {t("back")}
            </button>
            )}
            <button className="exitButton" onClick={handleLogout} style={{
                backgroundColor: "transparent", border: "5px solid white",
                
            }}>
                {t("exitAccount")}
            </button>
        </div>
        </div>
    );
}

export default JuniorSidebar