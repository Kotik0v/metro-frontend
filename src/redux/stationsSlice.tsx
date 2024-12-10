import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputValue: '',
    stations: [],
    currentFlowAnalysisId: null,
    currentCount: 0,
};

const stationsSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {
        setStations: (state, action) => {
            state.stations = action.payload;
        },
        setInputValue: (state, action) => {
            state.inputValue = action.payload;
        },
        setCurrentFlowAnalysisId: (state, action) => {
            state.currentFlowAnalysisId = action.payload;
        },
        setCurrentCount: (state, action) => {
            state.currentCount = action.payload;
        },
    },
});

export const {
    setStations,
    setInputValue,
    setCurrentFlowAnalysisId,
    setCurrentCount,
} = stationsSlice.actions;

export default stationsSlice.reducer;