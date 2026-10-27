import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
    // const isAuthenticated = useSelector((state) => state.protected.isAuthenticated);
    const isAuthenticated = localStorage.getItem("user_login");

    return isAuthenticated != null ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
