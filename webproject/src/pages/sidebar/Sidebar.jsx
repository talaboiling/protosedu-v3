import React from "react";
import "../../dashboard.css";
import logo from "../../assets/NAV_LOGO.webp";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { logout } from "../../utils/authService";
import { useTranslation } from "react-i18next";
import SeniorSidebar from "./SeniorSidebar";
import JuniorSidebar from "./JuniorSidebar";

const Sidebar = ({ isMenuOpen, user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Parse user information from local storage

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'));
  }

  console.log(user);

  const goBack = () => {
    console.log(user);
    // Conditional navigation based on user role
    if (user.role === "parent") {
      navigate("/parent");
    } else {
      // Handle other user roles if necessary
    }
  };

  console.log(user, "USER DATA 1234123412341234");

  let grade = localStorage.getItem('grade') ? parseInt(localStorage.getItem('grade')) : user.grade;
  
  return (
    <>
      {grade>4 && <SeniorSidebar isMenuOpen={isMenuOpen} sidebarType={"senior"} user={{...user, grade}} goBack={goBack} handleLogout={handleLogout}/>}
      {grade<=4 && <JuniorSidebar isMenuOpen={isMenuOpen} sidebarType={"junior"} user={{...user, grade}} goBack={goBack} handleLogout={handleLogout}/>}
    </>
  );
};

export default Sidebar;
