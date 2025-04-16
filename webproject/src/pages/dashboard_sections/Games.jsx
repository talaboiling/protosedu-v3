import "/src/dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Navdash from "../Navdash";
import { useEffect, useRef, useState } from "react";
import { playGame, fetchUserData } from "../../utils/apiService";
import Timer from "../../components/Timer";
import { useTranslation } from "react-i18next";
import Loader from "../Loader.jsx"
import OddOut from "../../assets/findtheoddout800450.webp"
import Watermelon from "../../assets/thewatermelongame800450.webp"
import TapItAway from "../../assets/tapitaway3d800450.webp"
import MergeCards from "../../assets/mergecards800450.webp"
import MusicMahjong from "../../assets/musicmahjong800450.webp"
import WaterSort from "../../assets/watersort800450.webp"
import TrafficControl from "../../assets/trafficcontrol800450.webp"
import lion_incorrect from "../../assets/lion_incorrect.webp";


const Games = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState({});
  const [isChild, setIsChild] = useState(false);
  const [childId, setChildId] = useState("");
  const [open, setOpen] = useState(false);
  const [gamePath, setGamePath] = useState("");
  const modalRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notEnoughStarsModal, setNotEnoughStarsModal] = useState(false);

  const GAME_COST = 20;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (open) {
        setOpen(false);
      }
    };
  }, [open]);

  const loadData = async () => {
    try {
      const childId = localStorage.getItem("child_id");
      let userData;
      if (childId) {
        userData = await fetchUserData(childId);
        setIsChild(true);
        setChildId(childId);
      } else {
        userData = await fetchUserData();
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openGameWindow = async (path, isFullUrl = false) => {
    try {
      const savedTime = localStorage.getItem('time');

      if (!savedTime || parseInt(savedTime, 10) <= 0) {
        const childId = localStorage.getItem("child_id");
        let response;

        if (childId) {
          console.log(childId);
          response = await playGame(childId);
        } else {
          response = await playGame();
        }

        if (!response.is_enough) {
          setNotEnoughStarsModal(true);
          return;
        }

        await loadData();
        localStorage.setItem('time', 300);
      }

      if (!open) {
        const updatedPath = isFullUrl ? path : (path.endsWith('/') ? `${path}index.html` : path);
        setGamePath(updatedPath);
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };



  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    setOpen(false);
  };

  const handleTimeUp = () => {
    closeModal();
    setOpen(false);
  };

  if (loading) {
    return <Loader />
  }




  return (
    <div className="rtdash rtrat gamesPage">
      <Sidebar isMenuOpen={isMenuOpen} />
      <div className="centralDash">
        <Navdash isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="game-div">
          {/* <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>
            <button onClick={() => openGameWindow("/games/3ryad/index.html")} className="game-button">Fantasy Forest</button>
          </div>
          <div className="game-container"></div>
          <button onClick={() => openGameWindow("/games/gonki/index.html")} className="game-button">Gonki</button>
          <button onClick={() => openGameWindow("https://cdn.htmlgames.com/FindTheOddOneOut/", true)} className="game-button"><img src={OddOut} alt="" className="gameImg" /></button>
          <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TheWatermelonGame/", true)} className="game-button"><img src={Watermelon} alt="" className="gameImg" /></button>
          <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TapItAway3D/", true)} className="game-button"><img src={TapItAway} alt="" className="gameImg" /></button>
          <button onClick={() => openGameWindow("https://cdn.htmlgames.com/MergeCards/", true)} className="game-button"><img src={MergeCards} alt="" className="gameImg" /></button>
          <button onClick={() => openGameWindow("https://cdn.htmlgames.com/MusicMahjong/", true)} className="game-button"><img src={MusicMahjong} alt="" className="gameImg" /></button>
          {/* <button onClick={() => openGameWindow("https://cdn.htmlgames.com/WaterSort/", true)} className="game-button"><img src={WaterSort} alt="" /></button> */}
          {/* <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TrafficControl/", true)} className="game-button"><img src={TrafficControl} alt="" className="gameImg" /></button> */}
          {/* <button onClick={() => openGameWindow("https://cdn.htmlgames.com/ConnectTheBlocks/", true)} className="game-button">Connect The Blocks</button> */}
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>
            <button onClick={() => openGameWindow("/games/3ryad/index.html")} className="game-button">Fantasy Forest</button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("/games/duckhunt/index.html")} className="game-button">Duck Hunt</button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("/games/gonki/index.html")} className="game-button">RACE GAME</button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/FindTheOddOneOut/", true)} className="game-button"><img src={OddOut} alt="" className="gameImg" /></button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TheWatermelonGame/", true)} className="game-button"><img src={Watermelon} alt="" className="gameImg" /></button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TapItAway3D/", true)} className="game-button"><img src={TapItAway} alt="" className="gameImg" /></button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/MergeCards/", true)} className="game-button"><img src={MergeCards} alt="" className="gameImg" /></button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/MusicMahjong/", true)} className="game-button"><img src={MusicMahjong} alt="" className="gameImg" /></button>
          </div>
          <div className="game-container">
            <span className="game-cost">{GAME_COST} ⭐</span>

            <button onClick={() => openGameWindow("https://cdn.htmlgames.com/TrafficControl/", true)} className="game-button"><img src={TrafficControl} alt="" className="gameImg" /></button>
          </div>
          {/* https://cdn.htmlgames.com/embed.js?game=TheWatermelonGame&amp;bgcolor=white */}
          {/* https://cdn.htmlgames.com/TapItAway3D/ */}
          {/* https://cdn.htmlgames.com/MergeCards/ */}
          {/* https://cdn.htmlgames.com/MusicMahjong/ */}
          {/* https://cdn.htmlgames.com/WaterSort/ */}
          {/* https://cdn.htmlgames.com/ZigZagGate/ */}
          {/* https://cdn.htmlgames.com/BubbleThrow/ */}
          {/* https://cdn.htmlgames.com/TrafficControl/ */}
          {/* https://cdn.htmlgames.com/ConnectTheBlocks/ */}
        </div>
        {
          open && (
            <dialog className="studmodal" ref={modalRef}>
              <div className="studmodal-content game-modal">
                <div className="modalHeader" style={{ marginBottom: "20px" }}>
                  <h2 className="defaultStyle" style={{ color: "#666" }}>{t('game')}</h2>
                  <button
                    style={{
                      float: "right",
                      backgroundColor: "lightgray",
                      border: "none",
                      borderRadius: "10px",
                      color: "#666",
                    }}
                    onClick={closeModal}
                  >
                    {t('close')}
                  </button>
                </div>
                <iframe
                  width="1000"
                  height="500"
                  src={gamePath.startsWith('http') ? gamePath : `https://games.protosedu.kz${gamePath}`}
                  title="Game"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="game-iframe"
                ></iframe>
                {open && <Timer isActive={open} onTimeUp={handleTimeUp} />}
              </div>
            </dialog>
          )
        }

        {notEnoughStarsModal && (
          <dialog className="studmodal" open>
            <div className="studmodal-content beautiful-modal">
              <h2 className="modal-title">{t('notEnoughStarsTitle')}</h2>
              <img src={lion_incorrect} alt="Lion Incorrect" className="modal-image" />
              <p className="modal-message">{t('notEnoughStarsMessage')}</p>
              <button className="modal-close-button" onClick={() => setNotEnoughStarsModal(false)}>
                {t('close')}
              </button>
            </div>
          </dialog>
        )}


      </div >
    </div >

  );
};

export default Games;
