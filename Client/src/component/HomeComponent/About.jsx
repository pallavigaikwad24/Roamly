import { useSelector } from "react-redux";

const About = () => {
    const url = useSelector((state) => state.backendUrl.url);
    return (
        <div className="about-container" id="about">
            <div className="about-hero">
                <img
                    src={`${url}/hotelPictures/defaultImg/home-back.jpg`}
                    alt="Travel Adventures"
                    className="about-hero-image"
                />
                <div className="hero-overlay">
                    <h1 className="hero-title">Discover Your Next Adventure</h1>
                    <p className="hero-subtitle">Exploring the world, one destination at a time</p>
                </div>
            </div>

            <div className="about-content">
                <div className="content-text">
                    <p>Welcome to Travelista, your gateway to extraordinary travel experiences. Since 2010,
                        we've been crafting unforgettable journeys for adventurous souls around the globe. Our
                        passion for travel and deep local connections ensure authentic experiences that go beyond
                        typical tourist routes.</p>
                </div>

                <div className="highlight-box">
                    <h3>Our Mission</h3>
                    <p>To create transformative travel experiences that inspire, connect, and enrich lives
                        while promoting sustainable and responsible tourism practices.</p>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <i className="fas fa-map-marked-alt feature-icon"></i>
                    <h3 className="feature-title">Curated Destinations</h3>
                    <p className="feature-text">Carefully selected locations offering unique experiences and
                        authentic local culture.</p>
                </div>

                <div className="feature-card">
                    <i className="fas fa-users feature-icon"></i>
                    <h3 className="feature-title">Expert Guides</h3>
                    <p className="feature-text">Professional local guides with deep knowledge and passion
                        for their regions.</p>
                </div>

                <div className="feature-card">
                    <i className="fas fa-shield-alt feature-icon"></i>
                    <h3 className="feature-title">Safe Travel</h3>
                    <p className="feature-text">Comprehensive safety measures and 24/7 support for worry-free
                        adventures.</p>
                </div>
            </div>

            <div className="stats-section">
                <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Countries</div>
                </div>

                <div className="stat-item">
                    <div className="stat-number">10k+</div>
                    <div className="stat-label">Happy Travelers</div>
                </div>

                <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Tours</div>
                </div>

                <div className="stat-item">
                    <div className="stat-number">12</div>
                    <div className="stat-label">Years Experience</div>
                </div>
            </div>
        </div>
    );
};

export default About;