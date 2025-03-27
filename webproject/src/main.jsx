import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./tailwind.css";
import Registration from "./pages/Registration.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rating from "./pages/dashboard_sections/Rating.jsx";
import Progress from "./pages/dashboard_sections/Pprogress.jsx";
import Lessons from "./pages/dashboard_sections/Lessons.jsx";
import Games from "./pages/dashboard_sections/Games.jsx";
import Vhod from "./pages/Login.jsx";
import Activate from "./pages/Activate.jsx";
import Parentdash from "./pages/Parentdash.jsx";
import Superdash from "./pages/Superdash.jsx";
import Superstudents from "./pages/admin_sections/Students.jsx";
import Tasks from "./pages/admin_sections/Tasks.jsx";
import SchoolDetails from "./pages/school_details/SchoolDetails.jsx";
import ClassDetails from "./pages/school_details/ClassDetails.jsx";
import MathCourse from "./pages/courses/Math.jsx";
import TaskSection from "./pages/admin_sections/Tasksection.jsx";
import SupervisorDashboard from "./pages/SupervisorDashboard.jsx";
import AuthRoute from "./AuthRoute.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Renewal from "./pages/Renewal.jsx";
import ChangePassword from "./ChangePassword.jsx";
import MainSubs from "./SubscriptionDetails.jsx";
import Oferty from "./Oferta.jsx";
import Confidentiality from "./Confidentiality.jsx";
import NotFound from "./NotFound.jsx";
import Chapters from "./pages/admin_sections/Chapters.jsx"
import CourseContent from "./pages/courses/CourseContent.jsx";
import ChapterContent from "./pages/courses/ChapterContent.jsx";
import Payment from "./pages/Payment.jsx";
import Nopayment from "./pages/Nopayment.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SubscriptionDetails from "./SubscriptionDetails.jsx";
import OlympRules from "./OlympRules.jsx";
import OlympRegRoles from "./OlympRegRoles.jsx";
import TeacherRegger from "./olympiada/olymp_regas/TeacherRegger.jsx";
import ParentRegger from "./olympiada/olymp_regas/ParentRegger.jsx";
import StudentRegger from "./olympiada/olymp_regas/StudentRegger.jsx";
import Ktp from "./pages/Ktp.jsx";
import TestsPage from "./pages/admin_components/TestsPage.jsx";
import QuestionsPage from "./pages/admin_components/QuestionsPage.jsx";
import QuestionDetailPage from "./pages/admin_components/QuestionDetailPage.jsx";
import TestsChild from "./pages/dashboard_sections/TestsChild.jsx";
import AdminTestPage from "./pages/admin_components/tests/AdminTestPage.jsx";
import TestChild from "./pages/dashboard_sections/tests/TestChild.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/tests", element: <TestsPage /> },
  { path: "/tests/:testId/questions", element: <QuestionsPage /> },
  { path: "/questions/:questionId", element: <QuestionDetailPage /> },
  { path: "/ktp", element: <Ktp /> },
  { path: "/login", element: <Vhod /> },
  { path: "/registration", element: <Registration /> },
  { path: "/activate/:activation_token", element: <Activate /> },
  { path: "/password-renewal", element: <Renewal /> },
  { path: "/reset-password/:token", element: <ChangePassword /> },
  { path: "/subscription-details", element: <MainSubs /> },
  { path: "/oferty", element: <Oferty /> },
  { path: "/users-terms-and-conditions", element: <Confidentiality /> },
  { path: "/payment-successful", element: <Payment /> },
  { path: "/payment-failed", element: <Nopayment /> },
  { path: "/olympiad-rules", element: <OlympRules /> },
  { path: "/olympiad-registrations", element: <OlympRegRoles /> },
  { path: "/registration-for-teachers", element: <TeacherRegger /> },
  { path: "/registration-for-parents", element: <ParentRegger /> },
  { path: "/registration-for-students", element: <StudentRegger /> },
  {
    path: "/parent",
    element: <AuthRoute element={<Parentdash />} allowedRoles={["parent"]} />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthRoute element={<Dashboard />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/rating",
    element: (
      <AuthRoute element={<Rating />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/progress",
    element: (
      <AuthRoute element={<Progress />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/lessons",
    element: (
      <AuthRoute element={<Lessons />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/tests",
    element: (
      <AuthRoute element={<TestsChild />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/games",
    element: (
      <AuthRoute element={<Games />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/courses/:courseId/sections",
    element: (
      <AuthRoute
        element={<CourseContent />}
        allowedRoles={["student", "parent"]}
      />
    ),
  },
  {
    path: "/dashboard/courses/:courseId/sections/:sectionId/chapters",
    element: (
      <AuthRoute
        element={<ChapterContent />}
        allowedRoles={["student", "parent"]}
      />
    ),
  },
  {
    path: "/dashboard/courses/:courseId/sections/:sectionId/chapters/:chapterId/lessons",
    element: (
      <AuthRoute
        element={<MathCourse />}
        allowedRoles={["student", "parent"]}
      />
    ),
  },
  {
    path: "/dashboard/tests/:testId",
    element: (
      <AuthRoute
        element={<TestChild />}
        allowedRoles={["student", "parent"]}
      />
    ),
  },
  {
    path: "/admindashboard",
    element: (
      <AuthRoute element={<Superdash />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/admindashboard/students",
    element: (
      <AuthRoute element={<Superstudents />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/admindashboard/tasks",
    element: <AuthRoute element={<Tasks />} allowedRoles={["superadmin"]} />,
  },
  {
    path: "/admindashboard/tests",
    element: (
      <AuthRoute element={<TestsPage />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/admindashboard/tests/:testId",
    element: (
      <AuthRoute element={<AdminTestPage />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/schools/:schoolId",
    element: (
      <AuthRoute
        element={<SchoolDetails />}
        allowedRoles={["superadmin", "supervisor"]}
      />
    ),
  },
  {
    path: "/schools/:schoolId/classes/:classId",
    element: (
      <AuthRoute
        element={<ClassDetails />}
        allowedRoles={["superadmin", "supervisor"]}
      />
    ),
  },
  {
    path: "/admindashboard/tasks/courses/:courseId/sections/:sectionId/chapters/:chapterId",
    element: (
      <AuthRoute element={<TaskSection />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/admindashboard/tasks/courses/:courseId/sections/:sectionId",
    element: (
      <AuthRoute element={<Chapters />} allowedRoles={["superadmin"]} />
    ),
  },
  {
    path: "/supervisor-dashboard",
    element: (
      <AuthRoute
        element={<SupervisorDashboard />}
        allowedRoles={["supervisor"]}
      />
    ),
  },
  // {
  //   path: "/subscriptions",
  //   element: (
  //     <AuthRoute element={<Subscriptions />} allowedRoles={["parent"]} />
  //   ),
  // },
  { path: "*", element: <NotFound /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
