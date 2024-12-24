import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './stationsSlice';
import flowAnalysisReducer from './flowAnalysisSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        stations: stationsReducer,
        flowAnalysis: flowAnalysisReducer,
        auth: authReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;