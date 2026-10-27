import { useEffect, useState } from 'react';
import '../../assets/style/hotelForm.css'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCountryList } from '../../redux/features/backendUrl/backendUrl';

const HotelForm = ({ onClose }) => {
    const countryList = useSelector((state) => state.backendUrl.countryList);
    const url = useSelector((state) => state.backendUrl.url);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(import.meta.env.VITE_COUNTRY_API).then((response) => {
            const countryNames = response.data.map(country => country.name.common).sort();
            dispatch(setCountryList(countryNames))
        }).catch((err) => console.log(err))
    }, [dispatch]);


    const [formData, setFormData] = useState({
        hotelName: '',
        country: '',
        location: '',
        price_per_night: '',
        available_rooms: '',
        images: [],
        services: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setFormData(prev => ({
                ...prev,
                services: [
                    ...prev.services,
                    name
                ]
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("FormData:", formData);
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.hotelName);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("price_per_night", formData.price_per_night);
        formDataToSend.append("available_rooms", formData.available_rooms);
        formDataToSend.append("services", JSON.stringify(formData.services));

        formData.images.forEach((image) => {
            formDataToSend.append("hotel_img", image);
        });

        axios.post(`${url}/hotel/add-hotel`, formDataToSend)
            .then((response) => console.log("Response:", response))
            .catch((err) => console.log(err));

        onClose();

    };

    const handleReset = () => {
        setFormData({
            hotelName: '',
            country: '',
            location: '',
            price_per_night: '',
            available_rooms: '',
            images: [],
            services: []
        });
    };

    return (
        <div className="form-container">
            <form className="hotel-form" onSubmit={handleSubmit}>
                <h2>Hotel Details</h2>
                <button type="button" className="close-btn" onClick={onClose}>×</button>

                {/* Hotel Name */}
                <div className="form-group">
                    <label htmlFor="hotelName">Hotel Name</label>
                    <input
                        type="text"
                        id="hotelName"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleInputChange}
                        placeholder="Enter hotel name"
                        required
                    />
                </div>

                {/* Country */}
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Country</option>
                        {countryList?.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter hotel location"
                        required
                    />
                </div>

                {/* Price per Night */}
                <div className="form-group">
                    <label htmlFor="price_per_night">Price per Night (₹)</label>
                    <input
                        type="number"
                        id="price_per_night"
                        name="price_per_night"
                        value={formData.price_per_night}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Enter price per night"
                        required
                    />
                </div>

                {/* Available Rooms */}
                <div className="form-group">
                    <label htmlFor="available_rooms">Available Rooms</label>
                    <input
                        type="number"
                        id="available_rooms"
                        name="available_rooms"
                        value={formData.available_rooms}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Enter available rooms"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Hotel Images</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            id="images"
                            name="images"
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                            className="file-input"
                        />
                        <label htmlFor="images" className="file-label">
                            Choose Images
                        </label>
                        <span className="file-info">
                            {formData.images.length} files selected
                        </span>
                    </div>
                </div>

                {/* Available Services */}
                <div className="form-group">
                    <label>Available Services</label>
                    <div className="services-grid">
                        {Object.entries({
                            wifi: 'WiFi',
                            parking: 'Parking',
                            pool: 'Swimming Pool',
                            restaurant: 'Restaurant',
                            gym: 'Fitness Center',
                            spa: 'Spa',
                            roomService: 'Room Service',
                            laundry: 'Laundry'
                        }).map(([key, label]) => (
                            <div className="service-item" key={key}>
                                <input
                                    type="checkbox"
                                    id={key}
                                    name={key}
                                    checked={formData.services[key]}
                                    onChange={handleServiceChange}
                                />
                                <label htmlFor={key}>{label}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Save Hotel Details</button>
                    <button type="reset" className="reset-btn" onClick={handleReset}>Reset Form</button>
                </div>
            </form>
        </div>
    );
};

export default HotelForm;
