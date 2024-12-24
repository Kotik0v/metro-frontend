import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowAnalysis, removeStationFromFlowAnalysis, updateStationOrder, formFlowAnalysis } from '../redux/flowAnalysisSlice';
import { RootState, AppDispatch } from '../redux/store';
import { FaTrashAlt } from 'react-icons/fa';

const FlowAnalysisPage: React.FC = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { flowAnalysis, loading, error } = useSelector((state: RootState) => state.flowAnalysis);

    useEffect(() => {
        if (requestId) {
            dispatch(fetchFlowAnalysis(parseInt(requestId, 10)));
        }
    }, [dispatch, requestId]);

    const handleRemoveStation = (stationId: number) => {
        if (requestId) {
            dispatch(removeStationFromFlowAnalysis({ requestId: parseInt(requestId, 10), stationId }));
        }
    };

    const handleUpdateOrder = (stationId: number, order: number) => {
        if (requestId) {
            dispatch(updateStationOrder({ requestId: parseInt(requestId, 10), stationId, order }));
        }
    };

    const handleFormFlowAnalysis = () => {
        if (requestId) {
            dispatch(formFlowAnalysis({ requestId: parseInt(requestId, 10) }));
            navigate('/flow-analysis');
        }
    };

    return (
        <div className="flow-analysis-page">
            <Navbar />
            <Breadcrumbs path="/flow-analysis" />
            <main className="container">
                <h1>Заявка</h1>
                {loading ? (
                    <p>Загрузка...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="flow-analysis-details">
                        <h2>Заявка №{flowAnalysis?.id}</h2>
                        <p>Статус: {flowAnalysis?.status}</p>
                        <ul className="stations-list">
                            {flowAnalysis?.stations.map((station, index) => (
                                <li key={station.station.id} className="station-item">
                                    <span className="station-order">{index + 1}</span>
                                    <span className="station-title">{station.station.title}</span>
                                    <input
                                        type="number"
                                        className="station-order-input"
                                        value={station.order}
                                        onChange={(e) => handleUpdateOrder(station.station.id, parseInt(e.target.value, 10))}
                                    />
                                    <FaTrashAlt className="station-remove" onClick={() => handleRemoveStation(station.station.id)} />
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleFormFlowAnalysis} className="form-button">
                            Сформировать заявку
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FlowAnalysisPage;