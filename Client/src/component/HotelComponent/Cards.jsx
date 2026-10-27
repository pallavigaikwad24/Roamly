import { useSelector } from "react-redux";

const Cards = ({ image, title, description, buttonText, rating }) => {
    const url = useSelector((state) => state.backendUrl.url);
    let maxRating = null;
    let renderStars = null;
    if (rating) {
        const ratingCal = rating?.map((r) => r.rating);
        maxRating = Math.max(...ratingCal);
        renderStars = (count) => {
            return Array.from({ length: count }, (_, index) => (
                <span key={index} style={{ "color": "#e4d05d", "marginLeft": "5px" }}> <i className="fa-solid fa-star"></i></ span>
            ));
        };
    }
    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" onError={(e) => e.target.src = `${url}/hotelPictures/defaultImg/default_location.png`} />
            <div className="card-content">
                <h3 className="card-title-search">{title}</h3>
                <p className="card-description">📍{description}</p>
                {
                    rating && rating?.length > 0 ? <p>{renderStars(maxRating)}</p> : <p>No ratings yet</p>
                }

                <button className="card-button">{buttonText}</button>
            </div>
        </div>
    );
};

export default Cards;