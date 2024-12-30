// StationPage.tsx

import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getStationById } from "../../store/slices/stationsSlice";
import StationCard from "../../components/StationCard/StationCard";
import "./StationPage.css";

const StationPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const station = useAppSelector((state) => state.stations.stations.find((station) => station.id === Number(id)));

    useEffect(() => {
        if (id) {
            dispatch(getStationById(id));
        }
    }, [id, dispatch]);

    if (!station) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="station-page">
            <StationCard
                station={station}
                imageClickHandler={() => {}}
                onAddToDraft={() => {}}
            />
        </div>
    );
};

export default StationPage;