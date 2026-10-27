import '../../assets/style/search.css';
import HotelSearch from '../../component/HotelComponent/HotelSearch';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOptionSelect } from '../../redux/features/search/searchHotelSlice';
import FlightSearch from '../../component/FlightComponent/FlightSearch';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HotelForm from '../../component/HotelComponent/HotelForm';
import Header from '../../component/HomeComponent/Header';
import { hideForm, setIsSearchRoute } from '../../redux/features/hotel/hotelSlice';

const Search = () => {

    const dispatch = useDispatch();
    const showForm = useSelector((state) => state.hotel.showForm);
    const isOptionSelect = useSelector((state) => state.searchHotel.isOptionSelect);

    useEffect(() => {
        dispatch(setIsSearchRoute());
    }, [dispatch])

    const handleSelectOption = (name) => {
        dispatch(setIsOptionSelect(name))
    }

    const onClse = () => {
        dispatch(hideForm())
    }

    return (
        <div className="search-page">
            {/* Header */}
            <Header />
            <header className='header-search'>
                <h1 style={{ fontFamily: "Baskervville SC, serif" }}>Travelista Tours</h1>
                <div className="optionDiv">
                </div>
                <div className="travel-option">
                    <div className="hotel" onClick={() => handleSelectOption("hotel")}>
                        <i className="fa-solid fa-hotel" name="hotel"></i>
                        <label htmlFor="hotel">Stay</label>
                    </div>
                    <div className="flight" onClick={() => handleSelectOption("flight")}>
                        <i className="fa-solid fa-plane" name="flight"></i>
                        <label htmlFor="flight">Flight</label>
                    </div>
                </div>
            </header>
            {
                isOptionSelect && isOptionSelect == "hotel" ? <HotelSearch /> : <FlightSearch />
            }

            {
                showForm &&
                <div className="hotelFormDiv">
                    <HotelForm onClose={onClse} />
                </div>
            }
        </div >
    );
};

export default Search;