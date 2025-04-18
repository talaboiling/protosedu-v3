import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import cups from "../../assets/sidecup.webp";
import cert from "../../assets/sideachieve.webp";
import prog from "../../assets/sideprog.webp";
import game from "../../assets/sidegame.webp";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { BookCheck, ScrollText, Users } from "lucide-react";

export const SidebarData = [
  {
    title: "Главная",
    icon: <HomeIcon sx={{ color: "#8A8A8A", fontSize: 50 }} />,
    link: "/dashboard",
  },
  {
    title: "Рейтинг",
    icon: <Users alt="achievements" size={32} color="#8A8A8A"/>,
    link: "/dashboard/rating",
  },
  {
    title: "Сертификаты",
    icon: <ScrollText alt="certificates" size={32} color="#8A8A8A"/>,
    link: "/dashboard/lessons",
  },
  {
    title: "Прогресс",
    icon: <img src={prog} alt="progress" />,
    link: "/dashboard/progress",
  },
  {
    title: "Игры",
    icon: <img src={game} alt="games" />,
    type: "junior",
    link: "/dashboard/games",
  },
  // {
  //     title: 'Подписки',
  //     icon: <SubscriptionsIcon/>,
  //     link: '/subscriptions'
  // }
];
