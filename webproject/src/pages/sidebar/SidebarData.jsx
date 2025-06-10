import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import cups from "../../assets/sidecup.webp";
import cert from "../../assets/sideachieve.webp";
import prog from "../../assets/sideprog.webp";
import game from "../../assets/sidegame.webp";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { BookCheck, ScrollText, Users, BrainCog } from "lucide-react";
import { BookOpenCheck } from "lucide-react";
export const SidebarData = [
  {
    title: "Главная",
    icon: <HomeIcon sx={{ color: "#8A8A8A", fontSize: 50 }} />,
    link: "/dashboard",
  },
  {
    title: "МОДО",
    icon: <BookOpenCheck alt="modo" size={32} color="#8A8A8A" />,
    link: "/dashboard/tests?type=modo",
  },
  {
    title: "ЕНТ",
    icon: <BookCheck alt="ent" size={32} color="#8A8A8A" />,
    link: "/dashboard/tests?type=ent",
  },
  {
    title: "PISA",
    icon: <BookOpenCheck alt="modo" size={32} color="#8A8A8A" />,
    link: "/dashboard/tests?type=pisa",
  },
  {
    title: "ИИ Репетитор",
    icon: <BrainCog alt="ai tutor" size={32} color="#8A8A8A" />,
    link: "/dashboard/ai-tutor",
    isNew: true
  },
  {
    title: "Рейтинг",
    icon: <Users alt="achievements" size={32} color="#8A8A8A" />,
    link: "/dashboard/rating",
  },
  {
    title: "Сертификаты",
    icon: <ScrollText alt="certificates" size={32} color="#8A8A8A" />,
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
