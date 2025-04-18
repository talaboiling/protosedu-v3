import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import "./DashboardLayout.css";
import Navdash from './Navdash';

const DashboardLayout = () => {

    const [user, setUser] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    useEffect(()=>{
        if (localStorage.getItem('user')){
            const userData = {...JSON.parse(localStorage.getItem('user'))}
            const grade = localStorage.getItem('grade')
            userData.grade = userData.grade ? userData.grade : grade;
            setUser(userData);
        }
    },[]);

    console.log(user, 123412341234);

    return (
        <div>
            <div className="rtdash dashMain">
                <Sidebar user={user} isMenuOpen={isMenuOpen}/>
                <div className='content'>
                    <div className='info'>
                        <Outlet context={{isMenuOpen, setIsMenuOpen}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout