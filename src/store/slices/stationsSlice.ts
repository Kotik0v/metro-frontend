import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Station, T_StationsListResponse } from "../../modules/types";
import { api } from "../../api";

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
        const response = await api.stations.stationsList({ title });
        return {
            stations: response.data.stations,
            draft_info: response.data.draft_info
        };
    }
);

export const getStationById = createAsyncThunk<T_Station, string>(
    "stations/getStationById",
    async (id) => {
        const response = await api.stations.stationsRead(id);
        return response.data;
    }
);

export const addStationToFlowAnalysis = createAsyncThunk<void, { stationId: string }>(
    "stations/addStationToFlowAnalysis",
    async ({ stationId }, { getState }) => {
        const state = getState() as { stations: StationsState };
        const draftInfo = state.stations.draft_info;

        if (draftInfo.draft_request_id) {
            await api.stations.stationsAddStationCreate(draftInfo.draft_request_id.toString(), { station_id: stationId });
        }
    }
);

const stationsSlice = createSlice({
    name: "stations",
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getStationsByName.fulfilled, (state, action: PayloadAction) => {
            state.stations = action.payload.stations;
            state.draft_info = action.payload.draft_info;
        });
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

export const { setTitle } = stationsSlice.actions;
export default stationsSlice.reducer;