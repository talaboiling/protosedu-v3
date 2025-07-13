import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import "./DashboardLayout.css";
import Navdash from './Navdash';
import Profile from './Profile';
import { fetchUserData } from '../utils/apiService';

const DashboardLayout = () => {

    const [user, setUser] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isProfileSwitched, setIsProfileSwitched] = useState(true);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          const childId = localStorage.getItem("child_id");
          try {
            setLoading(true);
            const userData = await fetchUserData(childId);
            console.log("userData", userData);
            if (userData.role === "parent") {
              userData.grade = userData.children ? userData.children[0].grade : 2;
            }
            localStorage.setItem('grade', userData.grade);
            setUser(userData);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

    console.log(user, 123412341234);

    return (
        <div>
            {user && 
            <>
                <Sidebar user={user} isMenuOpen={isMenuOpen}/>
                <div className="rtdash dashMain">
                    <div className='content'>
                      <Outlet context={{isMenuOpen, setIsMenuOpen, user}}/>
                    </div>
                    <Profile 
                      user={user} 
                      isProfileSwitched={isProfileSwitched} 
                      setIsProfileSwitched={setIsProfileSwitched}
                    /> 
                </div>
            </>
            }
        </div>
    )
}

export default DashboardLayout