import "./StationsPage.css";
import { FC, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import InputField from "../../components/InputField/InputField";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { T_Station } from "../../modules/types";
import StationCard from "../../components/StationCard/StationCard";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { useAppDispatch, RootState, useAppSelector } from "../../store/store";
import { getStationsByName, setTitle } from "../../store/slices/stationsSlice";
import STATIONS_MOCK from "../../modules/mock";

const StationsPage: FC = () => {
    const dispatch = useAppDispatch();
    const [stationTitle, setStationTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [stations, setStations] = useState<T_Station[]>([]);
    const selectedTitle = useAppSelector((state: RootState) => state.stations.title);

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedTitle) {
            setStationTitle(selectedTitle);
            handleSearch(selectedTitle);
        } else {
            handleSearch('');
        }
    }, [selectedTitle]);

    const handleSearch = (searchTerm: string) => {
        setLoading(true);
        dispatch(setTitle(searchTerm));

        dispatch(getStationsByName(searchTerm))
            .unwrap()
            .then((response) => {
                setStations(response.stations);
                setLoading(false);
            })
            .catch(() => {
                setStations(
                    STATIONS_MOCK.stations.filter((item: T_Station) =>
                        item.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
                setLoading(false);
            });
    };

    const handleCardClick = (id: number) => {
        navigate(`${ROUTES.STATIONS}/${id}/`);
    };

    const handleSubmit = () => {
        handleSearch(stationTitle);
    };

    return (
        <div className="custom-container">
            <div className="stations-data">
                <Row className="align-items-center">
                    <Col md={6}>
                        <div className="crumbs">
                            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.STATIONS }]} />
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <InputField
                            value={stationTitle}
                            placeholder="Поиск станции"
                            setValue={setStationTitle}
                            loading={loading}
                            onSubmit={handleSubmit}
                        />
                    </Col>
                </Row>
                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}
                {!loading && (
                    !stations.length ? (
                        <div>
                            <h1>Станции не найдены</h1>
                        </div>
                    ) : (
                        <Row className="g-3 p-3">
                            {stations.map((station) => (
                                <Col key={station.id} md={6}>
                                    <StationCard
                                        station={station}
                                        imageClickHandler={() => handleCardClick(station.id)}
                                        onAddToDraft={handleSubmit}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )
                )}
            </div>
            <Footer />
        </div>
    );
};

export default StationsPage;