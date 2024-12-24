
import { Carousel } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import '../App.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <Navbar />
            <div className="carousel-background">
                <Carousel controls={false} indicators={false} interval={3000} pause={false}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="http://127.0.0.1:9000/test/background.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="http://127.0.0.1:9000/test/background2.jpg"
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="http://127.0.0.1:9000/test/background3.jpg"
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <div className="overlay">
                    <h2 className="home-title">Metro Analysis</h2>
                    <p className="home-description">
                        Исследуйте и анализируйте потоки пассажиров в метро.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;