import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Station {
    id: number;
    title: string;
    picture_url: string;
    description: string;
}

interface FlowAnalysisStation {
    station: Station;
    order: number;
}

interface FlowAnalysis {
    id: number;
    status: string;
    stations: FlowAnalysisStation[];
}

interface FlowAnalysisState {
    flowAnalysis: FlowAnalysis | null;
    loading: boolean;
    error: string | null;
}

const initialState: FlowAnalysisState = {
    flowAnalysis: null,
    loading: false,
    error: null
};

export const fetchFlowAnalysis = createAsyncThunk<FlowAnalysis, number, { rejectValue: string }>(
    'flowAnalysis/fetchFlowAnalysis',
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/flow-analyses/${requestId}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке заявки.');
        }
    }
);

export const removeStationFromFlowAnalysis = createAsyncThunk<
    void,
    { requestId: number; stationId: number },
    { rejectValue: string }
>(
    'flowAnalysis/removeStationFromFlowAnalysis',
    async ({ requestId, stationId }, { rejectWithValue }) => {
        try {
            await axios.delete(`/flow-analyses/${requestId}/delete-station/${stationId}/`);
        } catch (error) {
            return rejectWithValue('Ошибка при удалении станции из заявки.');
        }
    }
);

export const updateStationOrder = createAsyncThunk<
        void,
    {requestId: number; stationId: number; order: number },
    { rejectValue: string }
>(
    'flowAnalysis/updateStationOrder',
    async ({ requestId, stationId, order }, { rejectWithValue }) => {
        try {
            await axios.put(`/flow-analyses/${requestId}/update-station/${stationId}/`, { order });
        } catch (error) {
            return rejectWithValue('Ошибка при изменении порядка станции.');
        }
    }
);

export const formFlowAnalysis = createAsyncThunk<void, { requestId: number }, { rejectValue: string }>(
    'flowAnalysis/formFlowAnalysis',
    async ({ requestId }, { rejectWithValue }) => {
        try {
            await axios.put(`/flow-analyses/form/${requestId}/`);
        } catch (error) {
            return rejectWithValue('Ошибка при формировании заявки.');
        }
    }
);

const flowAnalysisSlice = createSlice({
    name: 'flowAnalysis',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlowAnalysis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlowAnalysis.fulfilled, (state, action: PayloadAction<FlowAnalysis>) => {
                state.loading = false;
                state.flowAnalysis = action.payload;
            })
            .addCase(fetchFlowAnalysis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при загрузке заявки.';
            })
            .addCase(removeStationFromFlowAnalysis.fulfilled, (state, action) => {
                if (state.flowAnalysis) {
                    state.flowAnalysis.stations = state.flowAnalysis.stations.filter(
                        (station) => station.station.id !== action.meta.arg.stationId
                    );
                }
            })
            .addCase(removeStationFromFlowAnalysis.rejected, (state, action) => {
                state.error = action.payload || 'Ошибка при удалении станции из заявки.';
            })
            .addCase(updateStationOrder.rejected, (state, action) => {
                state.error = action.payload || 'Ошибка при изменении порядка станции.';
            })
            .addCase(formFlowAnalysis.rejected, (state, action) => {
                state.error = action.payload || 'Ошибка при формировании заявки.';
            });
    }
});

export default flowAnalysisSlice.reducer;