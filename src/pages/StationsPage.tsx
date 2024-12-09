import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card, Button, Form, Badge, Collapse, Container, Row, Col } from "react-bootstrap";

// Определение типа для объекта станции
interface Station {
    id: number;
    title: string;
    picture_url: string;
    description: string;
    line_number: string;
    line_name: string;
    line_color: string;
    average_visits: number;
}

// Определение типа для информации о текущем черновике заявки
interface DraftInfo {
    draft_request_id: number | null;
    count_stations: number;
    stations_in_draft: Station[];
}

// Mock-данные для станций, используются при сбое загрузки данных с API
const mockStations: Station[] = [
    {
        id: 1,
        title: "Бауманская",
        picture_url: "http://127.0.0.1:9000/test/1.jpg",
        description: "«Бауманская» — станция Московского метрополитена на Арбатско-Покровской линии.",
        line_number: "3",
        line_name: "Арбатско-Покровская",
        line_color: "#0072BA",
        average_visits: 114,
    },
    {
        id: 2,
        title: "Комсомольская",
        picture_url: "http://127.0.0.1:9000/test/2.jpg",
        description: "«Комсомольская» — станция Московского метрополитена на Кольцевой линии.",
        line_number: "5",
        line_name: "Кольцевая",
        line_color: "#8A0D0B",
        average_visits: 105,
    },
    {
        id: 3,
        title: "Киевская",
        picture_url: "http://127.0.0.1:9000/test/3.jpg",
        description: "«Киевская» — станция Московского метрополитена на Арбатско-Покровской и Кольцевой линии.",
        line_number: "4",
        line_name: "Филёвская",
        line_color: "#1EBCEF",
        average_visits: 87,
    }
];

const StationsPage = () => {
    const [stations, setStations] = useState<Station[]>(mockStations); // Использование mock-данных по умолчанию
    const [search, setSearch] = useState("");
    const [draftInfo, setDraftInfo] = useState<DraftInfo>({ draft_request_id: null, count_stations: 0, stations_in_draft: [] });
    const [open, setOpen] = useState(false); // Состояние для управления видимостью деталей черновика

    // Функция для загрузки списка станций и информации о текущей заявке
    const fetchStations = async () => {
        try {
            const response = await fetch("/api/stations/");
            if (!response.ok) throw new Error("Ошибка загрузки данных станций");
            const data = await response.json();
            setStations(data || []); // Установка пустого массива по умолчанию
            setDraftInfo(data.draft_info || { draft_request_id: null, count_stations: 0, stations_in_draft: [] });
        } catch (error) {
            console.error("Fallback to mock data due to API или network error", error);
            setStations(mockStations); // Возврат к mock-данным при ошибке
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    // Фильтрация станций по введенному тексту
    const filteredStations = stations ? stations.filter((station) =>
        station.title.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div>
            <Navbar />
            <Container className="mt-4">
                <Breadcrumbs path="/stations" />
                <h1 className="mb-4">Список станций</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Поиск по названию..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: "300px" }}
                    />
                    <Button
                        variant="outline-primary"
                        onClick={() => setOpen(!open)}
                        aria-controls="draft-details"
                        aria-expanded={open}
                        disabled={draftInfo.count_stations === 0}
                    >
                        Текущая заявка <Badge bg="secondary">{draftInfo.count_stations}</Badge>
                    </Button>
                </div>
                <Collapse in={open}>
                    <div id="draft-details">
                        {draftInfo.stations_in_draft.map((station) => (
                            <Card key={station.id} className="mb-2">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title>{station.title}</Card.Title>
                                        <Card.Text>
                                            {station.line_name} ({station.line_number})
                                        </Card.Text>
                                    </div>
                                    <Button variant="danger" size="sm" as={Link} to={`/flow-analyses/${draftInfo.draft_request_id}/delete-station/${station.id}`}>
                                        Удалить
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Collapse>
                <Row>
                    {filteredStations.map((station) => (
                        <Col md={4} key={station.id} className="mb-4">
                            <Card className="station-card">
                                <Card.Img variant="top" src={station.picture_url || "http://127.0.0.1:9000/test/default_station.jpg"} className="station-img" />
                                <Card.Body>
                                    <Card.Title className="station-title">{station.title}</Card.Title>
                                    <Card.Text className="station-description">{station.description}</Card.Text>
                                    <div className="station-line">
                                        <div className="line-circle" style={{ backgroundColor: station.line_color }}>
                                            {station.line_number}
                                        </div>
                                        <span className="line-name">{station.line_name}</span>
                                    </div>
                                    <Button variant="primary" as={Link} to={`/stations/${station.id}`} className="more-button">
                                        Подробнее
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default StationsPage;