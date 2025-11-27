import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user, status, initialized } = useSelector((s) => s.auth);

  // Don't redirect before we've attempted to fetch the authenticated user.
  if (!initialized || status === "loading") return null;

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
