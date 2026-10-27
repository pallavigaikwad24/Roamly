import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/features/protectedRoute/protectedRouteSlice';

function Logout() {
    const url = useSelector((state) => state.backendUrl.url);
    const dispatch = useDispatch();
    const handleLogout = () => {
        axios.get(`${url}/user/logout`).then(() => {
            dispatch(logout());
        }).catch((err) => {
            console.log(err);
            if (err.status == 401) localStorage.removeItem("user_login");
        });
    }
    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout
