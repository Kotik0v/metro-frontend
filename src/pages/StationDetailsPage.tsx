import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card } from "react-bootstrap";

const mockStationDetails = {
    1: {
        id: 1,
        title: "Бауманская",
        picture_url: "http://127.0.0.1:9000/test/1.jpg",
        description: "«Бауманская» — станция Московского метрополитена на Арбатско-Покровской линии.",
        line_number: "3",
        line_name: "Арбатско-Покровская",
        line_color: "#0072BA",
        average_visits: 114,
    },
    2: {
        id: 2,
        title: "Комсомольская",
        picture_url: "http://127.0.0.1:9000/test/2.jpg",
        description: "«Комсомольская» — станция Московского метрополитена на Кольцевой линии.",
        line_number: "5",
        line_name: "Кольцевая",
        line_color: "#8A0D0B",
        average_visits: 105,
    },
    3: {
        id: 3,
        title: "Киевская",
        picture_url: "http://127.0.0.1:9000/test/3.jpg",
        description: "«Киевская» — станция Московского метрополитена на Арбатско-Покровской и Кольцевой линии.",
        line_number: "4",
        line_name: "Филёвская",
        line_color: "#1EBCEF",
        average_visits: 87,
    },

};

const StationDetailsPage = () => {
    const { id } = useParams();
    const [station, setStation] = useState(mockStationDetails[id]);

    useEffect(() => {
        // Simulate fetching data
        const fetchStationDetails = async () => {
            try {
                // Simulate an API call
                const response = await fetch(`/api/stations/${id}/`);
                const data = await response.json();
                setStation(data);
            } catch (error) {
                console.error("Fallbackto mock data due to API or network error:", error);
                setStation(mockStationDetails[id]); // Fallback to mock data if fetch fails
            }
        };

        if (id && !mockStationDetails[id]) {
            fetchStationDetails();
        }
    }, [id]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <Breadcrumbs path={`/stations/${id}`} />
                <Card className="mb-4">
                    {station ? (
                        <>
                            <div className="line-banner" style={{ backgroundColor: station.line_color }}>
                                <span className="line-number">{station.line_number}</span>
                                <h2 className="station-details-title">{station.title}</h2>
                            </div>
                            <Card.Img variant="top" src={station.picture_url || "http://127.0.0.1:9000/test/default_station.jpg"} className="station-large-img" />
                            <Card.Body>
                                <Card.Text className="station-info">
                                    <strong>Описание:</strong> {station.description}
                                </Card.Text>
                                <Card.Text className="station-attendance">
                                    <strong>Средняя посещаемость:</strong> {station.average_visits} тыс. чел/сутки
                                </Card.Text>
                            </Card.Body>
                        </>
                    ) : (
                        <Card.Body>
                            <p>Станция не найдена или ошибка загрузки данных.</p>
                        </Card.Body>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default StationDetailsPage;
