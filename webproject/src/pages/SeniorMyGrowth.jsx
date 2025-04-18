import React from 'react'
import { useEffect, useState} from 'react'
import { fetchUserData, fetchWeeklyProgress } from "/src/utils/apiService";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Modal from '../helpers/Modal';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const SeniorMyGrowth = ({t, graphStyles}) => {
    const [user, setUser] = useState({ first_name: t("student"), last_name: "" }); // Default values
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileSwitched, setIsProfileSwitched] = useState(false);
    const [dailyProgress, setDailyProgress] = useState(null); // State for daily progress

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          const childId = localStorage.getItem("child_id");
          try {
            const [userData, weeklyProgressData] = await Promise.all([
              fetchUserData(childId),
              fetchWeeklyProgress(childId),
            ]);
    
            setUser(userData);
            setWeeklyProgress(weeklyProgressData.weekly_progress);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
    }, []);

    console.log(graphStyles);

    const data = {
        labels: weeklyProgress.map(caps=>t(caps.day).slice(0,2)),
        datasets: [
          {
            label: 'Очки',
            data: weeklyProgress.map((caps,index)=>caps.cups),
            borderColor: '#2979ff',
            backgroundColor: 'rgba(41, 121, 255, 0.2)',
            pointBackgroundColor: '#2979ff',
            tension: 0.4,
            fill: true,
          },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(Math.max(...weeklyProgress.map(caps=>caps.cups)),100),
            ticks: {
              stepSize: parseInt(Math.max(Math.max(...weeklyProgress.map(caps=>caps.cups)),100)/5),
            },
          },
          x: {
            grid: {
                drawTicks: true,
                color: (context) => {
                    const tickIndex = context.index;
                    const totalTicks = context.chart.scales.x.ticks.length;
                    if (tickIndex === 2 || tickIndex === 4 || tickIndex === totalTicks - 1) {
                      return 'rgba(221,221,221, 1)'; // Visible grid line color.
                    }
                    return 'transparent'; // Hide grid lines for other ticks.
                  },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
    };
    return (
        <div className="senior_section">
            <div style={{width: '100%', display: "flex", justifyContent: "space-between", alignItems:"center"}}>
                <p>Мое Развитие</p>
                <div className="senior_dropdown">Неделя ▼</div>
            </div>
            {/* Skip graph as requested */}
            <div style={{ width: graphStyles && graphStyles.width ? `${graphStyles.width}` : "80%",height: graphStyles && graphStyles.height ? `${graphStyles.height}` : `150px`, cursor: "pointer"}}>
              <Line data={data} options={options} onClick={()=>setShowModal(true)}/>
            </div>
            {showModal && (
                <Modal onClose={()=>setShowModal(false)} extraStyles={{borderRadius: "20px"}}>
                    <div style={{width: graphStyles && graphStyles.width ? `${graphStyles.width}` : `500px`, height: graphStyles && graphStyles.height ? `${graphStyles.height}` : `150px` }}>
                      <Line data={data} options={options}/>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default SeniorMyGrowth