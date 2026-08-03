import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLES, getDashboardPath } from "../types/roles";

const roleBySection = {
  candidate: ROLES.CANDIDATE,
  recruiter: ROLES.RECRUITER,
  admin: ROLES.ADMIN,
};

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712]">
      <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-400">Loading...</p>
    </div>
  );
}

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const section = location.pathname.split("/")[1];
  const requiredRole = roleBySection[section];

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return <Outlet />;
}
