import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BookCheck, UploadCloudIcon, Quote, AlertCircle } from 'lucide-react';

export const SupersideData = [
    {
        title: 'Платформы',
        icon: <HomeIcon sx={{ color: "white", fontSize: 20 }} />,
        link: '/admindashboard'
    },
    {
        title: 'Все Студенты',
        icon: <SchoolIcon />,
        link: '/admindashboard/students'
    },
    {
        title: 'Задания',
        icon: <BarChartIcon />,
        link: '/admindashboard/tasks'
    },
    {
        title: 'Тесты',
        icon: <BookCheck />,
        link: '/admindashboard/tests'
    },
    {
        title: 'КТП/КСП',
        icon: <UploadCloudIcon />,
        link: '/admindashboard/ktp'
    },
    {
        title: 'Фраза дня',
        icon: <Quote />,
        link: '/admindashboard/quotes'
    },
    {
        title: 'Жалобы',
        icon: <AlertCircle />,
        link: '/admindashboard/complaints'
    }

]