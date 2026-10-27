import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../redux/features/protectedRoute/protectedRouteSlice';
import { useNavigate } from "react-router-dom";
import { setShowForm } from "../../redux/features/hotel/hotelSlice";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("user_login"));
    const url = useSelector((state) => state.backendUrl.url);
    const isOptionSelect = useSelector((state) => state.searchHotel.isOptionSelect);
    const isSearchRoute = useSelector((state) => state.hotel.isSearchRoute);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleList = (e) => {
        e.preventDefault();
        if (!userInfo) {
            localStorage.removeItem("user_login");
            navigate("/login");
        };
        if (userInfo.user_type == 'admin' || userInfo.user_type == 'superAdmin')
            dispatch(setShowForm())
        else {
            navigate("/signup");
        }
    }

    const handleLogout = () => {
        axios.get(`${url}/user/logout`).then(() => navigate("/login")).catch((err) => {
            console.log(err);
            if (err.status == 401) { navigate("/login"); localStorage.removeItem("user_login") };
        });
        dispatch(logout());
    }
    return (
        <header className="header">
            <div className="logo">Travelista Tours</div>
            <nav>
                <div className="nav-links">
                    {
                        userInfo.user_type == 'superAdmin' &&
                        <div className="home-tab"><div className="a" onClick={() => navigate("/verify/verification-request")}><i className="fa-solid fa-calendar-check"></i>Approval Request</div></div>
                    }
                    {
                        isOptionSelect == "hotel" && isSearchRoute &&
                        <div className='home-tab'><div className="a" onClick={handleList}><i className="fa-solid fa-building"></i>List your property</div></div>
                    }
                    <div className="home-tab"><div className="a" onClick={() => navigate("/home")}><i className="fa-solid fa-house"  ></i>Home</div></div>
                    {/* Profile Dropdown */}
                    <div className="profile-dropdown">
                        <button
                            onClick={toggleDropdown}
                            className="profile-button"
                        >
                            <div className="avatar-container">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <span className="profile-name">{`${userInfo?.first_name}`}</span>
                            <i className={`fa-solid fa-angle-up chevron-icon ${isDropdownOpen ? 'rotate' : ''}`}></i>

                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <p className="user-name">{`${userInfo?.first_name} ${userInfo?.last_name}`}</p>
                                    <p className="user-email">{userInfo?.email}</p>
                                    <p style={{ 'color': 'purple' }}>{userInfo?.user_type}</p>
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                                    <i className="fa-solid fa-user"></i>
                                    Profile
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                    Sign out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;