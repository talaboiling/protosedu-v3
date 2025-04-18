import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import "./DashboardLayout.css";
import Navdash from './Navdash';

const DashboardLayout = () => {

    const [user, setUser] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(()=>{
        if (localStorage.getItem('user')){
            setUser(JSON.parse(localStorage.getItem('user')))
        }
    },[]);

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