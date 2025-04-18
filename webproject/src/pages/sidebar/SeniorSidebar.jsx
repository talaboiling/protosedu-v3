import React from 'react'
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import logo from "../../assets/NAV_LOGO.webp";
import { Link, NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { LogOut } from 'lucide-react';

const SeniorSidebar = ({user, isMenuOpen, goBack, handleLogout, sidebarType}) => {
    const { t } = useTranslation();
    console.log(user);
    return (
        <div className={`sidebar ${isMenuOpen ? "activeMenu" : ""} ${styles["sidebar"]}`}>
        <Link to={"/"}>
            <img src={logo} alt="logo" className="dashsidelogo" />
        </Link>
        <div className="excSideLogo senior">
            <ul className="sideItems" style={{width:"100%"}}>
            {SidebarData.map((item, index) => {
                if (!item.type || (item.type && item.type=="senior")){
                    const isActive = location.pathname === item.link;
                    const activeColor = isActive ? '#0077FF' : '#8A8A8A';
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
                    return (
                    <li
                        key={index}
                        className={`linkbuttons ${window.location.pathname === item.link ? styles["active"] : ""}`}
                        onClick={() => {
                            window.location.pathname = item.link;
                        }}
                    >
                        <NavLink to={item.link} className={`${styles["linkbuttonVal"]}`} style={{textDecoration: "none"}}>
                            {newIcon}
                            <span className="linkTitle">
                                {item.title}
                            </span>
                        </NavLink>
                    </li>
                    )
                }
            })}
            </ul>
            {/* Conditionally render the "Назад" button based on user role */}
            {user.role === "parent" && (
                <button className="exitButton" onClick={goBack}>
                    {t("back")}
                </button>
            )}
            <span className={styles["exitButton"]} onClick={handleLogout}>
                <LogOut/> 
                <p>{t("exitAccount")}</p>
            </span>
        </div>
        </div>
    );
}

export default SeniorSidebar