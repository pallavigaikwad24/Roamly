import ProfileHeader from './ProfileHeader';
import PropertyList from './PropertyList';
import HotelBookings from './HotelBooking';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Review from '../../component/HotelComponent/Review';

const ProfilePage = () => {
    axios.defaults.withCredentials = true;
    const url = useSelector((state) => state.backendUrl.url);

    const userProfile = JSON.parse(localStorage.getItem("user_login"));
    const [showAlert, setShowAleart] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const [propertyListing, setPropertyListing] = useState([]);
    const [hotelBooking, setHotelBooking] = useState([]);

    useEffect(() => {
        axios.get(`${url}/hotel/property/get-property`)
            .then((response) => {
                setPropertyListing(response.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 401) localStorage.removeItem("user_login");
            })

        axios.get(`${url}/hotel/hotel-booking/get-hotel-booking`)
            .then((response) => {
                console.log("28 res booking:", response.data);
                setHotelBooking(response.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 401) localStorage.removeItem("user_login");
            })
    }, [url])

    return (
        <div className="profile-container">
            <ProfileHeader profile={userProfile} />
            {
                console.log(propertyListing)
            }
            {
                propertyListing && (userProfile?.user_type == 'admin' || userProfile?.user_type == 'superAdmin') &&
                <PropertyList properties={propertyListing} />
            }
            {
                hotelBooking &&
                <HotelBookings bookings={hotelBooking} setShowReview={setShowReview} />
            }

            {
                showAlert &&
                <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <strong> Thank you for your feedback!.</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAleart(false)}></button>
                </div>
            }
            {
                showReview &&
                <Review setShowAleart={setShowAleart} setShowReview={setShowReview} />
            }
        </div>
    );
};

export default ProfilePage;