
const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
    };

    return (
        <div className="contact-container" id="contact">
            <div className="contact-header">
                <h1 className="contact-title">Let's Plan Your Next Adventure</h1>
                <p className="contact-subtitle">Have questions about our tours or need custom travel planning? We're here to help!</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-group">
                        <h3>Get in Touch</h3>
                        <div className="contact-details">
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <span>adventures@travelistatours.com</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-clock"></i>
                                <span>24/7 Travel Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-group">
                        <h3>Our Offices</h3>
                        <div className="office-locations">
                            <div className="office-card">
                                <h4>New York</h4>
                                <p>123 Adventure Ave</p>
                            </div>
                            <div className="office-card">
                                <h4>London</h4>
                                <p>456 Explorer St</p>
                            </div>
                            <div className="office-card">
                                <h4>Singapore</h4>
                                <p>789 Journey Rd</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Destination Interest</label>
                        <select className="form-input">
                            <option value="">Select destination</option>
                            <option value="europe">Europe</option>
                            <option value="asia">Asia</option>
                            <option value="americas">Americas</option>
                            <option value="africa">Africa</option>
                            <option value="oceania">Oceania</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Tell us about your dream vacation..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-button">
                        Start Planning
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;