// FlowAnalysisCard.tsx

import { FC, useState } from "react";
import { T_Station } from "../../modules/types";
import { useAppDispatch } from "../../store/store";
import { removeStationFromFlowAnalysis, updateStationInFlowAnalysis } from "../../store/slices/flowanalysisesSlice";
import "./FlowAnalysisCard.css";

const defaultImage = "/metro-frontend/images/DefaultStationImage.webp";

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
    const [localVisits, setLocalVisits] = useState<string>(String(station.average_visits));
    const [previousVisits, setPreviousVisits] = useState<string>(String(station.average_visits));

    const handleRemoveFromFlowAnalysis = async () => {
        try {
            await dispatch(removeStationFromFlowAnalysis({ stationId: station.id.toString() }));
        } catch (error) {
            console.error("Ошибка при удалении станции:", error);
        }
    };

    const handleBlur = () => {
        if (localVisits === "") {
            setLocalVisits(previousVisits);
            return;
        }

        if (localVisits !== previousVisits) {
            dispatch(updateStationInFlowAnalysis({
                stationId: station.id.toString(),
                visits: Number(localVisits)
            }));
            setPreviousVisits(localVisits);
        }
    };

    return (
        <div className="station-card">
            <img
                className="flow-station-photo"
                src={station.picture_url || defaultImage}
                alt="Station Image"
            />
            <div className="flow-station-details">
                <div className="left-station-details">
                    <h5 className="card-title">{station.title}</h5>
                    <p className="card-text"><strong>Линия:</strong> {station.line_name}</p>
                    <p className="card-text"><strong>Номер линии:</strong> {station.line_number}</p>
                </div>
                <div className="station-quantity-row">
                    <div className="quantity-label">Средние посещения:</div>
                    <div className="quantity-controls">
                        <input
                            type="number"
                            className="form-control"
                            min={1}
                            value={localVisits}
                            onChange={(e) => setLocalVisits(e.target.value)}
                            onBlur={handleBlur}
                            disabled={!editMode}
                        />
                    </div>
                    {showRemoveBtn && (
                        <div className="delete-button">
                            <button className="btn btn-outline-dark" onClick={handleRemoveFromFlowAnalysis}>
                                Удалить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlowAnalysisCard;