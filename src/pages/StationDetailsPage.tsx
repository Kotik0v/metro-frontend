import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card } from "react-bootstrap";

const mockStationDetails = {
    id: 1,
    title: "Бауманская",
    picture_url: "http://127.0.0.1:9000/test/1.jpg",
    description: "«Бауманская» — станция Московского метрополитена на Арбатско-Покровской линии.",
    line_number: "3",
    line_name: "Арбатско-Покровская",
    line_color: "#0072BA",
    average_visits: 114,
};

const StationDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [station, setStation] = useState(mockStationDetails);

    const fetchStationDetails = async (id: string) => {
        try {
            const response = await fetch(`/api/stations/${id}/`);
            if (!response.ok) throw new Error("Ошибка загрузки данных станции");
            const data = await response.json();
            setStation(data);
        } catch (error) {
            console.error("Fallback to mock data due to API или network error", error);
            setStation(mockStationDetails);
        }
    };

    useEffect(() => {
        if (id) fetchStationDetails(id);
    }, [id]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <Breadcrumbs path={`/stations/${id}`} />
                <Card className="mb-4">
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
                </Card>
            </div>
        </div>
    );
};

export default StationDetailsPage;