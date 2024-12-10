import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './stationsSlice';

const store = configureStore({
    reducer: {
        stations: stationsReducer,
    },
});

export default store;