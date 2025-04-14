import React from "react";
import "../../superdash.css";
import { Link } from "react-router-dom";
import logo from "../../assets/NAV_LOGO.webp";
import { SupersideData } from "./SupersideData";

const Superside = () => {
  return (
    <div className="superside">
      <Link to={"/"}>
        <img src={logo} alt="Vunderkids" style={{ margin: "50px", maxWidth: "200px" }} />
      </Link>
      <hr />
      <div className="excSideLogo supsideItems">
        <ul className="sideItems">
          {SupersideData.map((item, index) => {
            return (
              <li
                key={index}
                className="linkbuttons"
                id={window.location.pathname === item.link ? "active" : ""}
                onClick={() => {
                  window.location.pathname = item.link;
                }}
              >
                <Link to={item.link} className="slinkbuttonVal">
                  {item.icon}
                  <span className="linkTitle" id="linktit">
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Superside;
