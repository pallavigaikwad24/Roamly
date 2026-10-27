import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { setAllHotelInfo } from "../../redux/features/hotel/hotelSlice";

const Destinations = () => {
    const allHotelInfo = useSelector((state) => state.hotel.allHotelInfo);
    const url = useSelector((state) => state.backendUrl.url);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`${url}/hotel/get-all-hotels`)
            .then((response) => {
                dispatch(setAllHotelInfo(response.data));
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 401) {
                    navigate("/login");
                    localStorage.removeItem("user_login");
                }
            })
    }, [url, navigate, dispatch])

    return (
        <section className="destinations" id="destinations">
            <h2>Featured Hotels</h2>
            <div className="destination-list-home">

                <div className="image-scroller">
                    <div className="image-track">
                        {
                            allHotelInfo &&
                            allHotelInfo.map((hotel) => {
                                let maxRating = null;
                                let maxCount = 0;

                                const ratingCounts = hotel.ReviewHotelModels.reduce((acc, rating) => {
                                    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
                                    return acc;
                                }, {});

                                // Find the rating with the highest count for this post
                                for (const [rating, count] of Object.entries(ratingCounts)) {
                                    if (count > maxCount) {
                                        maxCount = count;
                                        maxRating = rating;
                                    }
                                }

                                if (maxRating >= 3 && maxRating <= 5) {
                                    return <div key={hotel.id} className="destination-card" >
                                        <img src={`${url}/hotelPictures/upload/${hotel?.owner_id}/${hotel.id}/${JSON.parse(hotel?.images)[0]}`} alt={hotel?.name}
                                            onError={(e) => e.target.src = `${url}/hotelPictures/defaultImg/default_location.png`} />
                                        <h3>{hotel?.name}</h3>
                                        <p>📍{hotel?.country}</p>
                                        <p>
                                            {[...Array(Number(maxRating))].map((_, index) => (
                                                <span key={index} style={{ "color": "#e4d05d", "marginLeft": "5px" }}><i className="fa-solid fa-star"></i></span>
                                            ))}
                                        </p>
                                        <button className="card-button" onClick={() => navigate(`/hotelname/${hotel?.id}`, { state: { hotel } })}>See More</button>
                                    </div>
                                }
                            })}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Destinations;