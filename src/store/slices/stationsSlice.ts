import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Station, T_StationsListResponse } from "../../modules/types";
import { api } from "../../api";
import STATIONS_MOCK from "../../modules/mock";

type StationsState = {
    stations: T_Station[];
    title: string;
    draft_info: {
        draft_request_id: number;
        count_stations: number;
        stations_in_draft: T_Station[];
    };
};

const initialState: StationsState = {
    stations: [],
    title: "",
    draft_info: {
        draft_request_id: 0,
        count_stations: 0,
        stations_in_draft: []
    }
};

export const getStationsByName = createAsyncThunk<T_StationsListResponse, string>(
    "stations/getStationsByName",
    async (title) => {
        try {
            const response = await api.stations.stationsList({ title });
            
            // Для неавторизованного пользователя (когда ответ - массив)
            if (Array.isArray(response.data)) {
                return {
                    stations: response.data,
                    draft_info: null
                };
            }
            
            // Для авторизованного пользователя (когда ответ - объект)
            return {
                stations: response.data.stations,
                draft_info: response.data.draft_info
            };
        } catch (error) {
            console.error('Error in getStationsByName:', error);
            // Фильтруем mock данные по названию станции
            const filteredStations = STATIONS_MOCK.stations.filter(station =>
                station.title.toLowerCase().includes(title.toLowerCase())
            );
            
            return {
                stations: filteredStations,
                draft_info: STATIONS_MOCK.draft_info
            };
        }
    }
);

export const getStationById = createAsyncThunk<T_Station, string>(
    "stations/getStationById",
    async (id) => {
        console.log('getStationById - Запрашиваемый ID:', id);
        try {
            const response = await api.stations.stationsRead(id);
            console.log('getStationById - Ответ API:', response.data);
            return response.data;
        } catch (error) {
            console.error('getStationById - Ошибка:', error);
            throw error;
        }
    }
);

export const addStationToFlowAnalysis = createAsyncThunk<void, { stationId: string }>(
    "stations/addStationToFlowAnalysis",
    async ({ stationId }) => {
        try {
            // Отправляем запрос на добавление станции напрямую
            await api.stations.stationsAddStationCreate({ station_id: stationId });
        } catch (error) {
            console.error("Ошибка при добавлении станции:", error);
            throw error;
        }
    }
);

const stationsSlice = createSlice({
    name: "stations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStationsByName.fulfilled, (state, action) => {
                console.log('API Response:', action.payload);
                state.stations = action.payload.stations;
                if (action.payload.draft_info) {
                    console.log('Setting draft info:', action.payload.draft_info);
                    state.draft_info = action.payload.draft_info;
                } else {
                    console.log('No draft info in response, setting default');
                    state.draft_info = {
                        draft_request_id: 0,
                        count_stations: 0,
                        stations_in_draft: []
                    };
                }
            })
        builder.addCase(getStationById.fulfilled, (state, action: PayloadAction) => {
            const index = state.stations.findIndex((station) => station.id === action.payload.id);
            if (index === -1) {
                state.stations.push(action.payload);
            } else {
                state.stations[index] = action.payload;
            }
        });
    }
});

export default stationsSlice.reducer;