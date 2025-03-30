import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BookCheck } from 'lucide-react';

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
    }
]