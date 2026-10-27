import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedLoginRoute = ({ element }) => {
    // const isAuthenticated = useSelector((state) => state.protected.isAuthenticated);
    const isAuthenticated = localStorage.getItem("user_login");

    return isAuthenticated != null ? <Navigate to="/home" /> : element;
};

export default ProtectedLoginRoute;
