import axios from 'axios';
import { setFilters, setSearchQuery } from '../../redux/features/search/searchHotelSlice';
import '../../assets/style/search.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeHotelList, setAllHotelInfo, setHotelList, setIsHotelList, setSearchHotelInfo } from '../../redux/features/hotel/hotelSlice';
import Cards from './Cards';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

const HotelSearch = () => {

    const searchQuery = useSelector((state) => state.searchHotel.searchQuery);
    const filters = useSelector((state) => state.searchHotel.filters);
    const hotels = useSelector((state) => state.hotel.hotelList);
    const isHotelList = useSelector((state) => state.hotel.isHotelList);
    const searchHotelInfo = useSelector((state) => state.hotel.searchHotelInfo);
    const allHotelInfo = useSelector((state) => state.hotel.allHotelInfo);
    const dispatch = useDispatch();
    const url = useSelector((state) => state.backendUrl.url);
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    axios.defaults.withCredentials = true;
    const [showHotel, setShowHotel] = useState(true);

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

    const handleSearchChange = (e) => {

        dispatch(setSearchQuery(e.target.value));

        axios.post(`${url}/search/hotel-list`, { name: e.target.value })
            .then((response) => {
                console.log(response.data);
                dispatch(setHotelList(response.data));
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 403) {
                    if (err.response.data[0].path == 'name') {
                        setShowHotel(true);
                        dispatch(removeHotelList());
                    }
                }
                if (err.status == 401) localStorage.removeItem("user_login");
            });
        setShowHotel(false);
    }

    const handleHotelList = (name, location, country) => {
        dispatch(setSearchQuery(`${name}, ${location}, ${country}`));
        dispatch(setFilters({ ...filters, search: location }));
        dispatch(setIsHotelList());
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const obj = {
            name: filters.search,
            start_date: filters.startDate,
            end_date: filters.endDate,
            rooms: filters.travelers
        }
        axios.post(`${url}/search/hotels`, obj)
            .then((response) => {
                dispatch(setSearchHotelInfo(response.data));
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 401) localStorage.removeItem("user_login");
            });
    };

    const handleSingleView = (id, info) => {
        navigate(`/hotelname/${id}`, { state: { info } });
    }

    return (
        <>
            {/* Search Bar */}
            <div className="search-container">
                <form className="search-bar">
                    <div className="search-bar-div">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            name='search'
                            placeholder="Where do you want to go?"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e)}
                        />
                        {
                            hotels && isHotelList &&
                            <div className="location-options">
                                <div className="option-card">
                                    {
                                        hotels && hotels.map((hotel, index) => (
                                            <div className="search-option" key={index}
                                                onClick={() => handleHotelList(hotel.name, hotel.location.split(",")[0], hotel.country)}>
                                                <i className="fa-solid fa-location-dot"></i>
                                                <div className="text">
                                                    <div className="location">{hotel.name}</div>
                                                    <div className="country">{`${hotel.location.split(",")[0]}, ${hotel.country}`}</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </form>


                {/* Filters */}
                <div className="filters" >
                    <div className="filter date">

                        <input
                            type="date"
                            value={filters.startDate}
                            name='check_in_date'
                            onChange={(e) => dispatch(setFilters({ ...filters, startDate: e.target.value }))}
                            min={today}
                        />
                    </div>
                    <div className="filter date">
                        <input
                            type="date"
                            name='check_out_date'
                            value={filters.endDate}
                            onChange={(e) => {
                                dispatch(setFilters({ ...filters, endDate: e.target.value }));
                            }}
                            min={today}
                        />
                    </div>
                    <div className="filter users">
                        <i className="fa-solid fa-users"></i>
                        <input
                            type="number"
                            name='number_of_rooms'
                            placeholder="Travelers"
                            value={filters.travelers}
                            onChange={(e) => dispatch(setFilters({ ...filters, travelers: e.target.value }))}
                            min={1}
                        />
                    </div>
                    <button type="submit" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {/* Destination List */}
            <div className="destination-list">
                <h2 className='dest-title'>Popular Hotels</h2>
                <div className="destinations-search">
                    {/* Example Destination Card */}
                    {
                        searchHotelInfo ? searchHotelInfo.map((hotel, index) => (
                            <div key={index} className='search-result' onClick={() => handleSingleView(hotel.id, filters)}>
                                <Cards
                                    image={`${url}/hotelPictures/upload/${hotel?.owner_id}/${hotel.id}/${JSON.parse(hotel.images)[0]}`}
                                    title={hotel.name}
                                    description={hotel.country}
                                    buttonText="See More"
                                    rating={hotel?.ReviewHotelModels}
                                />
                            </div>
                        )) : showHotel && allHotelInfo && allHotelInfo.map((hotel, index) => (
                            <div key={index} className='search-result' onClick={() => handleSingleView(hotel.id, filters)}>
                                <Cards
                                    image={`${url}/hotelPictures/upload/${hotel?.owner_id}/${hotel.id}/${JSON.parse(hotel.images)[0]}`}
                                    title={hotel.name}
                                    description={hotel.country}
                                    buttonText="See More"
                                    rating={hotel?.ReviewHotelModels}
                                />
                            </div>))
                    }
                </div>
            </div >

        </>
    );
};

export default HotelSearch;