import { useEffect, useState } from 'react';
import '../../assets/style/verificationRequest.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from '../../component/HomeComponent/Header';

const VerificationRequest = () => {

    const url = useSelector((state) => state.backendUrl.url);
    axios.defaults.withCredentials = true;
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        axios.get(`${url}/hotel/get-hotels/verify`)
            .then((response) => {
                console.log(" verification 14:", response.data);
                setProperties(response.data);
            })
            .catch((err) => {
                console.log(err);
                if (err.status == 401) localStorage.removeItem("user_login");
            });
    }, [url])



    const handleVerify = (id) => {
        setProperties(properties.map(property =>
            property.id === id
                ? { ...property, is_verified: true }
                : property
        ));

        axios.patch(`${url}/hotel/verify-hotel`, { hotel_id: id })
            .then((response) => console.log("35:", response))
            .catch((err) => {
                console.log(err);
                if (err.status == 401) localStorage.removeItem("user_login");
            })
    };

    const unverifiedCount = properties.filter(p => p.is_verified === false).length;

    return (
        <>
            <Header />
            <div className="properties-container">
                <div className="properties-header">
                    <h1 className="properties-title">Unverified Properties</h1>
                    {
                        unverifiedCount != 0 ? <div className="properties-count">
                            <i className="fa-solid fa-exclamation alert-icon"></i>
                            <span>{unverifiedCount} properties need verification</span>
                        </div> : ''
                    }

                </div>

                <div className="properties-grid">
                    {
                        properties && properties.length != 0 &&
                        properties
                            .filter(property => property.is_verified === false)
                            .map(property => (
                                <div key={property.id} className="property-card">
                                    <div className="property-content">
                                        <div className="property-info">
                                            <h3 className="property-address">{property.name}</h3>
                                            <p className="property-city">{property.location}</p>
                                            <p className="property-city">{property.country}</p>
                                        </div>
                                        <button
                                            onClick={() => handleVerify(property.id)}
                                            className="verify-button"
                                        >
                                            <i className="fa-regular fa-circle-check check-icon"></i>
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            ))}
                </div>

                {unverifiedCount === 0 && (
                    <div className="verified-message">
                        <i className="fa-regular fa-circle-check success-icon"></i>
                        <p>All properties have been verified!</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default VerificationRequest;