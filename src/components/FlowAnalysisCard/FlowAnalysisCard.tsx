// FlowAnalysisCard.tsx

import { FC, useState } from "react";
import { T_Station } from "../../modules/types";
import { useAppDispatch } from "../../store/store";
import { removeStationFromFlowAnalysis, updateStationInFlowAnalysis, updateStationOrder } from "../../store/slices/flowanalysisesSlice";
import "./FlowAnalysisCard.css";

const defaultImage = "http://127.0.0.1:9000/test/default_station.jpg";

interface FlowAnalysisCardProps {
    station: T_Station;
    showRemoveBtn?: boolean;
    editMode?: boolean;
}

export const FlowAnalysisCard: FC<FlowAnalysisCardProps> = ({
    station,
    showRemoveBtn = false,
    editMode = false,
}) => {
    const dispatch = useAppDispatch();
    const [localOrder, setLocalOrder] = useState<number>(station.order ?? 1);

    const handleRemoveFromFlowAnalysis = async () => {
        try {
            await dispatch(removeStationFromFlowAnalysis({ stationId: station.id.toString() }));
        } catch (error) {
            console.error("Ошибка при удалении станции:", error);
        }
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOrder = parseInt(e.target.value);
        if (!isNaN(newOrder) && newOrder > 0) {
            setLocalOrder(newOrder);
        }
    };

    const handleOrderBlur = async () => {
        console.log('1. handleOrderBlur начало, localOrder:', localOrder, 'station.order:', station.order);
        if (localOrder !== station.order) {
            try {
                console.log('2. Вызов updateStationOrder с параметрами:', {
                    stationId: station.id.toString(),
                    order: localOrder
                });
                await dispatch(updateStationOrder({
                    stationId: station.id.toString(),
                    order: localOrder
                })).unwrap();
                console.log('3. Успешное обновление порядка');
            } catch (error) {
                console.error('4. Ошибка при обновлении порядка:', error);
                setLocalOrder(station.order ?? 1);
            }
        }
    };

    return (
        <div className="flow-analysis-card">
            <div className="order-section">
                <input
                    type="number"
                    className="order-input"
                    min="1"
                    value={localOrder}
                    onChange={handleOrderChange}
                    onBlur={handleOrderBlur}
                    disabled={!editMode}
                />
            </div>
            <div className="station-image-container">
                <img
                    src={station.picture_url || defaultImage}
                    alt={station.title}
                    className="station-image"
                />
            </div>
            <div className="station-info">
                <h3 className="station-title">{station.title}</h3>
                <div className="station-line-info">
                    <div 
                        className="line-color-indicator" 
                        style={{ backgroundColor: station.line_color }}
                    >
                        {station.line_number}
                    </div>
                    <span>{station.line_name}</span>
                </div>
            </div>
            <div className="visits-info">
                <span>{station.average_visits} тыс. чел/сут</span>
            </div>
            {showRemoveBtn && (
                <button 
                    className="remove-station-btn"
                    onClick={handleRemoveFromFlowAnalysis}
                >
                    Удалить
                </button>
            )}
        </div>
    );
};

export default FlowAnalysisCard;