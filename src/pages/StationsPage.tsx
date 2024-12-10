import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStations, setInputValue, setCurrentFlowAnalysisId, setCurrentCount } from '../redux/stationsSlice';
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { Card, Button, Form, Badge, Collapse, Container, Row, Col } from "react-bootstrap";

// Define the Station type
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

// Define the DraftInfo type
interface DraftInfo {
    draft_request_id: number | null;
    count_stations: number;
    stations_in_draft: Station[];
}

const mockResponse = {
    stations: [
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
    ],
    draft_info: {
        draft_request_id: 0,
        count_stations: 0,
        stations_in_draft: [/*
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
            }*/
        ]
    }
};

const StationsPage = () => {
    const { stations, inputValue, currentFlowanalysisId, currentCount } = useSelector((state) => state.stations);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // Initialize draftInfo with default values
    const [draftInfo, setDraftInfo] = useState<DraftInfo>({
        draft_request_id: null,
        count_stations: 0,
        stations_in_draft: []
    });

    const fetchStations = async () => {
        try {
            const response = await fetch('/api/stations/');
            const data = await response.json();
            dispatch(setStations(data.stations || []));
            setDraftInfo(data.draft_info || {
                draft_request_id: null,
                count_stations: 0,
                stations_in_draft: []
            });
            dispatch(setCurrentCount(data.draft_info?.count_stations || 0));
        } catch (error) {
            console.error('Error fetching stations:', error);
            dispatch(setStations(mockResponse.stations));
            setDraftInfo(mockResponse.draft_info);
            dispatch(setCurrentCount(mockResponse.draft_info.count_stations));
        }
    };

    useEffect(() => {
        if (!stations.length) {
            fetchStations();
        }
    }, [dispatch, stations.length]);

    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        dispatch(setInputValue(searchText));
        if (!searchText.trim()) {
            fetchStations();
        } else {
            filterStations(searchText);
        }
    };

    const filterStations = async (searchText) => {
        try {
            const response = await fetch(`/api/stations/?title=${encodeURIComponent(searchText)}`);
            const data = await response.json();
            dispatch(setStations(data.stations || []));
        } catch (error) {
            console.error('Error searching stations:', error);
            const filteredLocalStations = mockResponse.stations.filter(station =>
                station.title.toLowerCase().includes(searchText.toLowerCase())
            );
            dispatch(setStations(filteredLocalStations));
        }
    };

    return (
        <>
            <Navbar />
            <Container className="mt-4">
                <Breadcrumbs path="/stations" />

                <h1 className="text-center mb-4">Список станций</h1>

                <Row className="mb-4">
                    <Col md={8}>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <Form.Control
                                type="text"
                                placeholder="Поиск..."
                                value={inputValue}
                                onChange={handleSearchChange}
                            />
                        </Form>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button
                            variant="danger"
                            onClick={() => setOpen(!open)}
                        >
                            Заявка <Badge bg="light" text="dark">{currentCount}</Badge>
                        </Button>
                    </Col>
                </Row>

                <Collapse in={open}>
                    <div className="mb-4">
                        <Card>
                            <Card.Body>
                                <h5>Черновик заявки</h5>
                                {draftInfo.stations_in_draft.length > 0 ? (
                                    draftInfo.stations_in_draft.map((station) => (
                                        <p key={station.id}>{station.title}</p>
                                    ))
                                ) : (
                                    <p>Список станций пуст.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>

                <Row>
                    {stations.length > 0 ? (
                        stations.map((station) => (
                            <Col md={4} sm={6} key={station.id} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={station.picture_url || "http://127.0.0.1:9000/test/default_station.jpg"} alt={station.title} />
                                    <Card.Body>
                                        <h5>{station.title}</h5>
                                        <p style={{ color: station.line_color }}>{station.line_name}</p>
                                        <Link to={`/stations/${station.id}`}>
                                            <Button variant="outline-primary">Подробнее</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>Нет данных о станциях. Попробуйте изменить поисковый запрос.</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default StationsPage;