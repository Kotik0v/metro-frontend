import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card, Button, Form } from "react-bootstrap";

interface Station {
    id: number;
    title: string;
    pic: string;
    description: string;
    line_number: string;
    line_name: string;
    line_color: string;
    average_visits: number;
}

const mockStations: Station[] = [
    {
        id: 1,
        title: "Бауманская",
        pic: "http://127.0.0.1:9000/test/1.jpg",
        description:
            "«Бауманская» — станция Московского метрополитена на Арбатско-Покровской линии.",
        line_number: "3",
        line_name: "Арбатско-Покровская",
        line_color: "#0072BA",
        average_visits: 114,
    },
    {
        id: 2,
        title: "Комсомольская",
        pic: "http://127.0.0.1:9000/test/2.jpg",
        description: "станция Московского метрополитена на Кольцевой линии.",
        line_number: "1",
        line_name: "Сокольническая",
        line_color: "#D41317",
        average_visits: 49,
    },
    {
        id: 3,
        title: "Киевская",
        pic: "http://127.0.0.1:9000/test/3.jpg",
        description: "станция Московского метрополитена на Кольцевой линии.",
        line_number: "3",
        line_name: "Арбатско-Покровская",
        line_color: "#0072BA",
        average_visits: 68,
    },
];

const StationsPage = () => {
    const [stations, setStations] = useState<Station[]>(mockStations);
    const [search, setSearch] = useState("");

    const fetchStations = async () => {
        try {
            const response = await fetch("/api/stations/");
            if (!response.ok) throw new Error("Ошибка загрузки данных станций");
            const data = await response.json();
            setStations(data.stations);
        } catch (error) {
            setStations(mockStations);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    const filteredStations = stations.filter((station) =>
        station.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <Breadcrumbs path="/stations" />
                <h1 className="mb-4">Список станций</h1>
                <Form className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Поиск по названию..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Form>
                <div className="row">
                    {filteredStations.map((station) => (
                        <div className="col-md-4 mb-4" key={station.id}>
                            <Card>
                                <Card.Img variant="top" src={station.pic} />
                                <Card.Body>
                                    <Card.Title>{station.title}</Card.Title>
                                    <Card.Text>{station.description}</Card.Text>
                                    <Button
                                        as={Link}
                                        to={`/stations/${station.id}`}
                                        variant="primary"
                                    >
                                        Подробнее
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StationsPage;