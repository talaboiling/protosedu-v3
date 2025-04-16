import React from 'react';
import Navdash from '../Navdash';
import SeniorWelcome from './seniorDashboard/SeniorWelcome';

const SeniorDashboardContent = ({data,options, user, courses, isMenuOpen,setIsMenuOpen, isProfileSwitched, setIsProfileSwitched, t}) => {
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
            <SeniorWelcome
                t={t}
                user={user}
            />
        </>
    )
}

export default SeniorDashboardContent