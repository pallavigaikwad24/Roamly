import About from "../../component/HomeComponent/About"
import Contact from "../../component/HomeComponent/Contact"
import Destinations from "../../component/HomeComponent/Destinations"
import Footer from "../../component/HomeComponent/Footer"
import Header from "../../component/HomeComponent/Header"
import Hero from "../../component/HomeComponent/Hero"
import '../../assets/style/home.css'

function Home() {
    return (
        <div className="App">
            <Header />
            <Hero />
            <Destinations />
            <About />
            <Contact />
            <Footer />
        </div>
    )
}

export default Home
