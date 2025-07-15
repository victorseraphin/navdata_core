// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return children;
}
