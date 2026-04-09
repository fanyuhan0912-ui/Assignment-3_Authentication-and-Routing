import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, profile } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}

export default AdminProtectedRoute;