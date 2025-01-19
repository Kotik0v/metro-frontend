import { FC, useState, useEffect, useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { Station } from '../../types/types';
import './StationCard.css';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addStationToFlowAnalysis, getStationsByName } from "../../store/slices/stationsSlice";

const defaultImage = "http://127.0.0.1:9000/test/default_station.jpg";

interface StationCardProps {
    station: Station;
    imageClickHandler: () => void;
}

const StationCard: FC<StationCardProps> = ({ station, imageClickHandler }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const draftInfo = useAppSelector((state) => state.stations.draft_info);
    const [isLoading, setIsLoading] = useState(false);

    const isStationInDraft = useMemo(() => {
        if (!draftInfo || !draftInfo.stations_in_draft) return false;
        return draftInfo.stations_in_draft.some(
            draftStation => Number(draftStation.id) === Number(station.id)
        );
    }, [draftInfo, station.id]);

    const handleAddToAnalysis = async (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('1. Начало handleAddToAnalysis, stationId:', station.id);
        try {
            setIsLoading(true);
            console.log('2. Вызов addStationToFlowAnalysis');
            await dispatch(addStationToFlowAnalysis({ stationId: station.id.toString() })).unwrap();
            console.log('3. Успешно выполнен addStationToFlowAnalysis');
            await dispatch(getStationsByName("")).unwrap();
            console.log('4. Успешно обновлен список станций');
        } catch (error) {
            console.error("5. Ошибка при добавлении станции:", error);
        } finally {
            setIsLoading(false);
            console.log('6. Завершение handleAddToAnalysis');
        }
    };

    return (
        <Card className="stations-list-card h-100" onClick={() => imageClickHandler()}>
            <div className="stations-list-image-container">
                <Card.Img 
                    variant="top" 
                    src={station.picture_url || defaultImage} 
                    alt={station.title}
                    className="stations-list-image"
                />
            </div>
            <Card.Body className="card-body">
                <Card.Title className="stations-list-title">
                    {station.title}
                </Card.Title>
                <div className="stations-list-line-info">
                    <div 
                        className="stations-list-line-indicator" 
                        style={{ backgroundColor: station.line_color }}
                    >
                        {station.line_number}
                    </div>
                    <span>{station.line_name} линия</span>
                </div>
                {isAuthenticated && !isStationInDraft && (
                    <button 
                        className="stations-list-add-btn"
                        onClick={handleAddToAnalysis}
                        disabled={isLoading}
                        title="Добавить в заявку"
                    >
                        {isLoading ? '...' : '+'}
                    </button>
                )}
            </Card.Body>
        </Card>
    );
};

export default StationCard;