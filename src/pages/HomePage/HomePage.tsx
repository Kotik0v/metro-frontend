import { FC, useEffect } from "react";
import { Carousel } from 'react-bootstrap';
import "./HomePage.css";
import  Footer  from "../../components/footer/footer";

export const HomePage: FC = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="home">
            <div className="carousel-container">
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
            </div>
            <div className="overlay" />
            <div className="content">
                <h1>Metro Analysis</h1>
                <p>
                    Исследуйте и анализируйте потоки пассажиров в метро.
                </p>
            </div>
            <Footer style={{ 
                position: 'absolute',
                bottom: 0, 
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} />
        </div>
    );
};

export default HomePage;