import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card, Button, Form } from "react-bootstrap";
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

    const fetchFlowAnalysis = async () => {
        try {
            const response = await fetch(`/api/flow-analyses/${flowAnalysis.request_id}/`);
            if (!response.ok) throw new Error("Ошибка загрузки данных о заявке");
            const data = await response.json();
            setFlowAnalysis(data);
        } catch (error) {
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
                    <Form.Control
                        as="select"
                        value={selectedTime}
                        onChange={handleTimeSelect}
                    >
                        <option value="">Выберите время</option>
                        <option value="morning">Утро</option>
                        <option value="day">День</option>
                        <option value="evening">Вечер</option>
                    </Form.Control>
                </Form>
                <div className="row">
                    {flowAnalysis.stations.map((station) => (
                        <div className="col-md-4 mb-4" key={station.id}>
                            <Card>
                                <Card.Img variant="top" src={station.pic} />
                                <Card.Body>
                                    <Card.Title>{station.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Линия:</strong> {station.line_name} ({station.line_number})
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Средняя посещаемость:</strong> {station.average_visits} тыс. чел/сутки
                                    </Card.Text>
                                    <Button
                                        variant="danger"
                                        as={Link}
                                        to={`/flow-analyses/${flowAnalysis.request_id}/delete-station/${station.id}`}
                                    >
                                        Удалить
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

export default FlowAnalysisPage;