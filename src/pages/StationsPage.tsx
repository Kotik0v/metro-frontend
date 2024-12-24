import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchStations, searchStations, addStationToFlowAnalysis } from '../redux/stationsSlice';
import { RootState, AppDispatch } from '../redux/store';

const StationsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { stations, currentCount, currentFlowAnalysisId, loading, error } = useSelector((state: RootState) => state.stations);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (!stations.length && !loading) {
            dispatch(fetchStations());
        }
    }, [dispatch, stations.length, loading]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        if (!e.target.value.trim()) {
            dispatch(fetchStations());
        } else {
            dispatch(searchStations(e.target.value));
        }
    };

    const handleAddStation = (stationId: number) => {
        dispatch(addStationToFlowAnalysis(stationId));
    };

    return (
        <div className="stations-page">
            <Navbar />
            <Breadcrumbs path="/stations" />
            <main className="container">
                <h1>Список станций</h1>
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <ul className="stations-list">
                    {loading && <li>Загрузка...</li>}
                    {error && <li>{error}</li>}
                    {!loading && stations.length === 0 && <li>Нет данных о станциях.</li>}
                    {stations.map((station) => (
                        <li key={station.id} className="station-item">
                            <img src={station.picture_url} alt={station.title} className="station-image" />
                            <div className="station-info">
                                <Link to={`/stations/${station.id}`} className="station-title">
                                    {station.title}
                                </Link>
                                <p>{station.line}</p>
                                <button onClick={() => handleAddStation(station.id)} disabled={currentCount === 0}>Добавить в заявку</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flow-analysis-link">
                    <Link to={`/flow-analysis/${currentFlowAnalysisId}`} className={`link-button ${currentCount === 0 ? 'disabled-link' : ''}`}>Перейти к заявке ({currentCount})</Link>
                </div>
            </main>
        </div>
    );
};

export default StationsPage;