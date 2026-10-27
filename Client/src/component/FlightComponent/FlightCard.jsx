import { useState } from "react";
import "../../assets/style/flightCard.css";
import Payment from "../../pages/Payment_gateway/Payment";
import axios from "axios";
import { useSelector } from "react-redux";

const FlightCard = ({ flight, seats }) => {
    const dateString = flight.departure_date;
    const date = new Date(dateString);

    const [isPayment, setIsPayment] = useState(false);
    const url = useSelector((state) => state.backendUrl.url);

    const departureDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const arrivalDateString = flight.arrival_date;
    const Arrivaldate = new Date(arrivalDateString);

    const arrivalDate = Arrivaldate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const parseTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(":");

        const date = new Date();
        date.setHours(hours, minutes, seconds, 0); // Set hours, minutes, and seconds
        return date;
    };

    const date1 = parseTime(flight?.departure_time);
    const date2 = parseTime(flight?.arrival_time);

    const differenceInMilliseconds = Math.abs(date2 - date1);

    // Convert milliseconds to minutes
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = Math.floor(differenceInMinutes % 60);

    return (
        <div className="flight-ticket">
            <div className="ticket-container">
                <div className="ticket-left">
                    {/* Upgrade Banner */}
                    <div className="upgrade-banner">
                        <span>Flexible ticket upgrade available</span>
                    </div>

                    {/* Flight Details */}
                    <div className="flight-details">
                        {/* Departure */}
                        <div className="time-section">
                            <div className="time">{flight?.departure_time}</div>
                            <div className="date">{flight.departure_airport} · {departureDate}</div>
                        </div>

                        {/* Flight Path */}
                        <div className="flight-path">
                            <div className="line"></div>
                            <div className="stops">
                                {/* <div>0 stops</div> */}
                                <div>{hours}h {minutes}m</div>
                            </div>
                            <div className="line"></div>
                        </div>

                        {/* Arrival */}
                        <div className="time-section">
                            <div className="time">{flight?.arrival_time}</div>
                            <div className="date">{flight.arrival_airport} · {arrivalDate}</div>
                        </div>
                    </div>

                    {/* Airlines */}
                    <div className="airlines">
                        {flight.airline}
                    </div>
                </div>

                {/* Price Section */}
                <div className="ticket-right">
                    <div className="included-item">
                        <svg className="bag-icon" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Included: personal item</span>
                    </div>

                    <div className="price">INR{flight.price.toLocaleString()}</div>
                    {
                        <Payment setIsPayment={setIsPayment} isPayment={isPayment} amount={flight?.price} flight_id={flight.id} number_of_seats={seats} btnName={"Book Flight"} />
                    }
                    {/* <button className="view-details" onClick={() => handlePayment()}> Book Flight </button> */}
                </div>
            </div>
        </div>
    );
};

export default FlightCard;