import React from 'react';
import classes from "./styles.module.css";
import senior_welcome from "../../../assets/Frame 15 1 (1).png";

const SeniorWelcome = ({t, user}) => {
    return (
        <div className={classes.box}>
            <div className={classes.overlap}>
                <div className={classes["text-wrapper"]}>
                    {t("hello")}, {user.first_name}!
                </div>
            </div>
        </div>
    );
}

export default SeniorWelcome