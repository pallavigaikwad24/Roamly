import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/search");
  }
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Explore the World with Us</h1>
        <p>Discover amazing destinations and create unforgettable memories.</p>
        <button className="cta-button" onClick={handleClick}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;