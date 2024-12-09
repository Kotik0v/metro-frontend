import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../index.css";

const HomePage = () => {
    return (
        <div className="home-container">
            <Navbar />
            <main className="home-main">
                <h2 className="home-title">Добро пожаловать в Metro Analysis</h2>
                <p className="home-description">
                    Исследуйте и анализируйте потоки пассажиров в метро.
                </p>
                <div className="home-buttons">
                    <Link to="/stations" className="btn btn-primary">
                        Список станций
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;