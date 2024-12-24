import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/axiosConfig';
import mockStations from '../mocks/mockStations';

interface Station {
    id: number;
    title: string;
    picture_url: string;
    description: string;
}

interface DraftInfo {
    draft_request_id: number | null;
    count_stations: number;
}

interface StationsState {
    stations: Station[];
    inputValue: string;
    currentFlowAnalysisId: number | null;
    currentCount: number;
    station: Station | null;
    loading: boolean;
    error: string | null;
}

const initialState: StationsState = {
    stations: [],
    inputValue: '',
    currentFlowAnalysisId: null,
    currentCount: 0,
    station: null,
    loading: false,
    error: null
};

export const fetchStations = createAsyncThunk(
    'stations/fetchStations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/stations/');
            return response.data;
        } catch (error) {
            console.error('Backend is down, using mock data', error);
            return mockStations;  // Используем mock данные при ошибке
        }
    }
);

export const searchStations = createAsyncThunk<Station[], string, { rejectValue: string }>(
    'stations/searchStations',
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/stations/?title=${encodeURIComponent(searchText)}`);
            return response.data.stations;
        } catch (error) {
            console.error('Error searching stations, using fallback');
            return mockStations.stations.filter(station =>
                station.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    }
);

export const addStationToFlowAnalysis = createAsyncThunk<void, number, { rejectValue: string }>(
    'stations/addStationToFlowAnalysis',
    async (stationId, { rejectWithValue }) => {
        try {
            await axios.post(`/stations/add/${stationId}/`);
        } catch (error) {
            console.error('Error adding station to flow analysis, using fallback');
            return rejectWithValue('Ошибка при добавлении станции в заявку.');
        }
    }
);

export const fetchStationDetails = createAsyncThunk<Station, number, { rejectValue: string }>(
    'stations/fetchStationDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/stations/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching station details, using fallback');
            return mockStations.stations.find(station => station.id === id) || rejectWithValue('Ошибка при загрузке информации о станции.');
        }
    }
);

const stationsSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {
        setInputValue: (state, action: PayloadAction<string>) => {
            state.inputValue = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStations.fulfilled, (state, action) => {
                state.loading = false;
                state.stations = action.payload.stations;
                // Проверяем, есть ли draft_info перед использованием
                if (action.payload.draft_info) {
                    state.currentFlowAnalysisId = action.payload.draft_info.draft_request_id;
                    state.currentCount = action.payload.draft_info.count_stations;
                }
            })
            .addCase(fetchStations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при загрузке станций.';
            })
            .addCase(searchStations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchStations.fulfilled, (state, action) => {
                state.loading = false;
                state.stations = action.payload;
            })
            .addCase(searchStations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при поиске станций.';
            })
            .addCase(addStationToFlowAnalysis.rejected, (state, action) => {
                state.error = action.payload || 'Ошибка при добавлении станции в заявку.';
            })
            .addCase(fetchStationDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStationDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.station = action.payload;
            })
            .addCase(fetchStationDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при загрузке информации о станции.';
            });
    }
});


export const { setInputValue } = stationsSlice.actions;
export default stationsSlice.reducer;