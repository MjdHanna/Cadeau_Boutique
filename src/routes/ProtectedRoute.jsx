import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/features/authSlice";
import { useGetProfileQuery } from "../redux/features/apiSlice";

const ProtectedRoute = ({ children }) => {
  const token = useSelector(selectToken);
  const { data: user, isLoading } = useGetProfileQuery();

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) return <div>Loading...</div>; // أو Skeleton/Spinner

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
