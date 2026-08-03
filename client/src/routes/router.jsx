import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import VerifyEmail from "../components/auth/VerifyEmail";
import CandidateDashboard from "../pages/candidate/Dashboard";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

import CandidateJobs from "../pages/candidate/Jobs";
import CandidateApplications from "../pages/candidate/Applications";
import CandidateResume from "../pages/candidate/Resume";
import CandidateResumeAI from "../pages/candidate/ResumeAI";
import CandidateJobMatching from "../pages/candidate/JobMatching";
import CandidateInterviews from "../pages/candidate/Interviews";
import CandidateNotifications from "../pages/candidate/Notifications";
import CandidateProfile from "../pages/candidate/Profile";
import CandidateSettings from "../pages/candidate/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },

  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "/reset-password",
            element: <ResetPassword />,
          },
          {
            path: "/verify-email",
            element: <VerifyEmail />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/candidate",
        element: <CandidateLayout />,
        children: [
          {
            path: "dashboard",
            element: <CandidateDashboard />,
          },
          {
            path: "jobs",
            element: <CandidateJobs />,
          },
          {
            path: "applications",
            element: <CandidateApplications />,
          },
          {
            path: "resume",
            element: <CandidateResume />,
          },
          {
            path: "resume-ai",
            element: <CandidateResumeAI />,
          },
          {
            path: "job-matching",
            element: <CandidateJobMatching />,
          },
          {
            path: "interviews",
            element: <CandidateInterviews />,
          },
          {
            path: "notifications",
            element: <CandidateNotifications />,
          },
          {
            path: "profile",
            element: <CandidateProfile />,
          },
          {
            path: "settings",
            element: <CandidateSettings />,
          },
        ],
      },
      {
        path: "/recruiter",
        element: <RecruiterLayout />,
        children: [
          {
            path: "dashboard",
            element: <RecruiterDashboard />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
]);

export default router;
