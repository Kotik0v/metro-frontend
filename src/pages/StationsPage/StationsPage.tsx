import "./StationsPage.css";
import { FC, useEffect, useState } from "react";
import { Col, Row, Spinner, Container, Button } from "react-bootstrap";
import InputField from "../../components/InputField/InputField";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { T_Station } from "../../modules/types";
import StationCard from "../../components/StationCard/StationCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getStationsByName } from "../../store/slices/stationsSlice";
import STATIONS_MOCK from "../../modules/mock";
import DraftWidget from "../../components/DraftWidget/DraftWidget";

const StationsPage: FC = () => {
    const [loading, setLoading] = useState(false);
    const [stationTitle, setStationTitle] = useState("");
    const dispatch = useAppDispatch();
    
    const stations = useAppSelector((state) => state.stations.stations || []);
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const draftInfo = useAppSelector((state) => 
        isAuthenticated ? state.stations.draft_info : null
    );
    const draftStationsCount = draftInfo?.count_stations ?? 0;
    const navigate = useNavigate();
    const [isDraftWidgetOpen, setIsDraftWidgetOpen] = useState(false);

    const toggleDraftWidget = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDraftWidgetOpen(!isDraftWidgetOpen);
    };

    useEffect(() => {
        const fetchStations = async () => {
            try {
                setLoading(true);
                await dispatch(getStationsByName(stationTitle)).unwrap();
            } catch (error) {
                console.error('Ошибка при загрузке станций:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, [dispatch, stationTitle]);

    const handleSearch = (searchTerm: string) => {
        setLoading(true);
        dispatch(getStationsByName(searchTerm))
            .unwrap()
            .then(() => {})
            .catch((error) => {
                console.error('Ошибка при поиске станций:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCardClick = (id: number) => {
        navigate(`${ROUTES.STATIONS}/${id}`);
    };

    const handleSubmit = () => {
        handleSearch(stationTitle);
    };

    const handleDraftClick = () => {
        if (draftInfo && draftInfo.draft_request_id) {
            navigate(`${ROUTES.FLOW_ANALYSES}/${draftInfo.draft_request_id}`);
        }
    };

    return (
        <div className="custom-container">
            <div className="stations-data">
                <div className="stations-header">
                    <div className="crumbs">
                        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.STATIONS }]} />
                    </div>
                    <div className="search-container">
                        <InputField
                            value={stationTitle}
                            placeholder="Поиск станции"
                            setValue={setStationTitle}
                            loading={loading}
                            onSubmit={handleSubmit}
                        />
                    </div>
                    
                    <div className="draft-button-container">
                        <div className="draft-widget-wrapper">
                            <Button 
                                variant="danger"
                                disabled={!isAuthenticated || draftStationsCount === 0}
                                onClick={handleDraftClick}
                                className="draft-button"
                            >
                                <span>Заявка</span>
                                {draftStationsCount > 0 && (
                                    <div className="draft-count">{draftStationsCount}</div>
                                )}
                            </Button>
                            {isAuthenticated && draftStationsCount > 0 && (
                                <button 
                                    className="toggle-widget-btn"
                                    onClick={toggleDraftWidget}
                                    title="Показать список станций"
                                >
                                    {isDraftWidgetOpen ? '×' : '▼'}
                                </button>
                            )}
                        </div>
                        
                        {isAuthenticated && draftInfo && (
                            <DraftWidget 
                                stations={draftInfo.stations_in_draft}
                                draftId={draftInfo.draft_request_id}
                                isOpen={isDraftWidgetOpen}
                                onToggle={toggleDraftWidget}
                            />
                        )}
                    </div>

                </div>
                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}
                {!loading && (
                    !stations?.length ? (
                        <div>
                            <h1>Станции не найдены</h1>
                        </div>
                    ) : (
                        <Container fluid>
                            <Row xs={1} md={2} className="g-4">
                                {stations.map((station) => (
                                    <Col key={station.id}>
                                        <StationCard
                                            station={station}
                                            imageClickHandler={() => handleCardClick(station.id)}
                                            onAddToDraft={handleSubmit}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    )
                )}
            </div>
        </div>
    );
};

export default StationsPage;