// import { Hotel, MapPin, BedDouble, Calendar } from 'lucide-react';

const HotelBookings = ({ bookings, setShowReview }) => {
    return (
        <div className="card-profile">
            <div className="card-header">
                <h2 className="card-title-profile">
                    <i className="fa-solid fa-hotel"></i>
                    Hotel Bookings
                </h2>
            </div>
            <div className="card-content-profile">
                <div className="grid-container">
                    {bookings && bookings?.length != 0 ?
                        bookings.map(booking => (
                            <div key={booking.id} className="card-profile">
                                <div className="card-content-profile">
                                    <h3 className="item-title">{booking?.HotelModel?.name}</h3>
                                    <div className="item-details">
                                        <div className="detail-row">
                                            <i className="fa-solid fa-map-pin"></i>
                                            <span>{booking?.HotelModel?.location}</span>
                                        </div>
                                        <div className="detail-row">
                                            <i className="fa-regular fa-calendar"></i>
                                            <span>{new Date(booking?.check_in_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} to {new Date(booking?.check_out_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="badge">
                                            <span className={`status-badge ${booking.booking_status === true
                                                ? 'booked'
                                                : 'not-booked'
                                                }`}>
                                                {booking.booking_status ? 'Booked' : 'In-proccess'}
                                            </span>
                                            <button className="review-btn" onClick={() => setShowReview(true)}>Add Review</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <div>No Booking Yet!</div>}
                </div>
            </div>
        </div>
    );
};

export default HotelBookings;