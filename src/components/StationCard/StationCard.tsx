import { FC } from "react";
import "./StationCard.css";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addStationToFlowAnalysis } from "../../store/slices/stationsSlice";
import { T_Station } from "../../modules/types";

const defaultImage = "/metro-frontend/images/DefaultStationImage.webp";

interface StationCardProps {
    station: T_Station;
    imageClickHandler: () => void;
    onAddToDraft: () => void;
}

export const StationCard: FC<StationCardProps> = ({
                                                      station,
                                                      imageClickHandler,
                                                      onAddToDraft,
                                                  }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);

    const handleAddToDraftFlowAnalysis = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await dispatch(addStationToFlowAnalysis({ stationId: station.id.toString() }));
        onAddToDraft();
    };

    return (
        <div className="station-card" onClick={imageClickHandler}>
            <img
                className="station-photo"
                src={station.picture_url || defaultImage}
                alt="Station Image"
            />
            <div className="station-details">
                <h5 className="card-title">{station.title}</h5>
                <p className="card-text"><strong>Линия:</strong> {station.line_name}</p>
                <p className="card-text"><strong>Номер линии:</strong> {station.line_number}</p>
                {isAuthenticated && (
                    <div className="add-section">
                        <button
                            className="btn btn-outline-dark btn-sm min-width-button"
                            type="button"
                            onClick={handleAddToDraftFlowAnalysis}
                        >
                            Добавить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationCard;