import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card, Button, Form, Table, Badge, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

interface FlowAnalysisStation {
    id: number;
    title: string;
    pic: string;
    line_number: string;
    line_name: string;
    line_color: string;
    average_visits: number;
}

interface FlowAnalysis {
    request_id: number;
    stations: FlowAnalysisStation[];
}

const mockFlowAnalysis: FlowAnalysis = {
    request_id: 1,
    stations: [
        {
            id: 1,
            title: "Бауманская",
            pic: "http://127.0.0.1:9000/test/1.jpg",
            line_number: "3",
            line_name: "Арбатско-Покровская",
            line_color: "#0072BA",
            average_visits: 114,
        },
        {
            id: 2,
            title: "Комсомольская",
            pic: "http://127.0.0.1:9000/test/2.jpg",
            line_number: "1",
            line_name: "Сокольническая",
            line_color: "#D41317",
            average_visits: 49,
        },
    ],
};

const FlowAnalysisPage = () => {
    const [flowAnalysis, setFlowAnalysis] = useState<FlowAnalysis>(mockFlowAnalysis);
    const [selectedTime, setSelectedTime] = useState("");
    const [viewMode, setViewMode] = useState("card");  // Toggle between 'card' and 'table'

    const fetchFlowAnalysis = async () => {
        try {
            const response = await fetch(`/api/flow-analyses/${flowAnalysis.request_id}/`);
            if (!response.ok) throw new Error("Ошибка загрузки данных о заявке");
            const data = await response.json();
            setFlowAnalysis(data);
        } catch (error) {
            console.error("Fallback to mock data due to API or network error", error);
            setFlowAnalysis(mockFlowAnalysis);
        }
    };

    useEffect(() => {
        fetchFlowAnalysis();
    }, []);

    const handleTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <Breadcrumbs path="/flow-analysis" />
                <h1 className="mb-4">Создание заявки</h1>
                <Form className="mb-4">
                    <Form.Group>
                        <Form.Label>Выберите время</Form.Label>
                        <Form.Control as="select" value={selectedTime} onChange={handleTimeSelect}>
                            <option value="">Выберите время</option>
                            <option value="morning">Утро</option>
                            <option value="day">День</option>
                            <option value="evening">Вечер</option>
                        </Form.Control>
                    </Form.Group>
                </Form>

                <ToggleButtonGroup type="radio" name="viewMode" defaultValue={viewMode} onChange={(value) => setViewMode(value)}>
                    <ToggleButton id="view-mode-card" variant="outline-primary" value="card">
                        Карточки
                    </ToggleButton>
                    <ToggleButton id="view-mode-table" variant="outline-primary" value="table">
                        Таблица
                    </ToggleButton>
                </ToggleButtonGroup>

                {viewMode === "card" ? (
                    <div className="row mt-3">
                        {flowAnalysis.stations.map(station => (
                            <div className="col-md-4 mb-4" key={station.id}>
                                <Card>
                                    <Card.Img variant="top" src={station.pic || "http://127.0.0.1:9000/test/default_station.jpg"} />
                                    <Card.Body>
                                        <Card.Title>{station.title}</Card.Title>
                                        <Card.Text>
                                            <strong>Линия:</strong> {station.line_name} ({station.line_number})
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Средняя посещаемость:</strong> {station.average_visits} тыс. чел/сутки
                                        </Card.Text>
                                        <Button variant="danger" as={Link} to={`/flow-analyses/${flowAnalysis.request_id}/delete-station/${station.id}`}>
                                            Удалить
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Линия</th>
                            <th>Средняя посещаемость (тыс. чел/сутки)</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flowAnalysis.stations.map((station, index) => (
                            <tr key={station.id}>
                                <td>{index + 1}</td>
                                <td>{station.title}</td>
                                <td>
                                    <Badge bg="secondary" style={{ backgroundColor: station.line_color }}>
                                        {station.line_name} ({station.line_number})
                                    </Badge>
                                </td>
                                <td>{station.average_visits}</td>
                                <td>
                                    <Button variant="danger" size="sm" as={Link} to={`/flow-analyses/${flowAnalysis.request_id}/delete-station/${station.id}`}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}

            </div>
        </div>
    );
};

export default FlowAnalysisPage;