// StationPage.tsx

import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getStationsByName } from "../../store/slices/stationsSlice";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import "./StationPage.css";

const StationPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const station = useAppSelector((state) => state.stations.stations.find((station) => station.id === Number(id)));
    const defaultImage = "http://127.0.0.1:9000/test/default_station.jpg";

    useEffect(() => {
        if (!station && id) {
            dispatch(getStationsByName(""))
                .unwrap()
                .then(() => {
                })
                .catch((error) => {
                    console.error('Error fetching stations:', error);
                });
        }
    }, [id, dispatch, station]);

    if (!station) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="station-page">
            <div className="custom-container">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.STATIONS, path: ROUTES.STATIONS },
                        { label: station.title }
                    ]}
                />
                
                <div className="station-details">
                    <div 
                        className="station-header" 
                        style={{
                            backgroundColor: station.line_color,
                            borderRadius: '8px',
                            padding: '12px 20px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <div 
                            className="line-number"
                            style={{
                                backgroundColor: '#fff',
                                color: station.line_color,
                                padding: '4px 8px',
                                borderRadius: '4px',
                                marginRight: '12px',
                                fontWeight: 'bold'
                            }}
                        >
                            {station.line_number}
                        </div>
                        <h1 style={{ color: '#fff', margin: 0 }}>
                            {station.title}
                        </h1>
                    </div>

                    <div className="station-image-wrapper">
                        <img 
                            src={station.picture_url || defaultImage} 
                            alt={station.title} 
                            className="station-detail-image"
                        />
                    </div>

                    <div className="station-info-card mt-4">
                        <div className="station-description">
                            <h3>Описание</h3>
                            <p>{station.description}</p>
                        </div>

                        <div className="station-stats">
                            <h3>Посещаемость</h3>
                            <p className="visits-count">
                                {station.average_visits} тыс.
                            </p>
                            <p className="text-muted">
                                человек в сутки в среднем за квартал
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationPage;