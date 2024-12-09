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
                    Исследуйте и анализируйте пассажирский поток в метро.
                </p>
                <div className="home-buttons">
                    <Link to="/stations" className="btn btn-primary">
                        Список станций
                    </Link>
                    <Link to="/flow-analysis" className="btn btn-secondary">
                        Заявка
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;