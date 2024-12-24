import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStationDetails } from '../redux/stationsSlice';
import { RootState, AppDispatch } from '../redux/store';

const StationDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { station, loading, error } = useSelector((state: RootState) => state.stations);

    useEffect(() => {
        if (id) {
            dispatch(fetchStationDetails(parseInt(id, 10)));
        }
    }, [dispatch, id]);



    return (
        <div className="station-details-page">
            <Navbar />
            <Breadcrumbs path={`/stations/${id}`} />
            <main className="container">
                {loading ? (
                    <p>Загрузка...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <h2>{station?.title}</h2>
                        <img
                            src={station?.picture_url || 'http://127.0.0.1:9000/test/default_station.jpg'}
                            alt={station?.title}
                            className="station-image"
                        />
                        <p>{station?.description}</p>

                    </>
                )}
            </main>
        </div>
    );
};

export default StationDetailsPage;