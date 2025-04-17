import React from "react";
import "../../dashboard.css";
import logo from "../../assets/NAV_LOGO.webp";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { logout } from "../../utils/authService";
import { useTranslation } from "react-i18next";
import SeniorSidebar from "./SeniorSidebar";
import JuniorSidebar from "./JuniorSidebar";

const Sidebar = ({ isMenuOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Parse user information from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => {
    console.log(user);
    // Conditional navigation based on user role
    if (user.role === "parent") {
      navigate("/parent");
    } else {
      // Handle other user roles if necessary
    }
  };

  return (
    <div className="">
      <p style={{display:"none"}}>Sidebar</p>
      {user.grade>4 && <SeniorSidebar isMenuOpen={isMenuOpen} sidebarType={"senior"} user={user} goBack={goBack} handleLogout={handleLogout}/>}
      {user.grade<=4 && <JuniorSidebar isMenuOpen={isMenuOpen} sidebarType={"junior"} user={user} goBack={goBack} handleLogout={handleLogout}/>}
    </div>
  );
};

export default Sidebar;
