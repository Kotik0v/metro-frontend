import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_FlowAnalysis } from "../../modules/types";
import { api } from "../../api";
import { RootState } from "../../store";

type FlowAnalysisesState = {
    flowanalysis: T_FlowAnalysis | null;
    flowanalyses: T_FlowAnalysis[];
    filters: {
        status: string;
        date_start: string;
        date_end: string;
    }
};

const initialState: FlowAnalysisesState = {
    flowanalysis: null,
    flowanalyses: [],
    filters: {
        status: "all",
        date_start: "",
        date_end: ""
    }
};

export const getFlowAnalysisById = createAsyncThunk<T_FlowAnalysis, string>(
    "flowanalyses/getFlowAnalysisById",
    async (id) => {
        try {
            console.log('getFlowAnalysisById - Запрашиваемый ID:', id);
            const response = await api.flowAnalyses.flowAnalysesRead(id);
            console.log('getFlowAnalysisById - Ответ API:', response.data);
            return response.data;
        } catch (error) {
            console.error('getFlowAnalysisById - Ошибка:', error);
            throw error;
        }
    }
);

export const fetchFlowAnalysis = createAsyncThunk<void, void>(
    "flowanalysises/fetchFlowAnalysis",
    async (_, { getState }) => {
        const state = getState() as { flowanalysises: FlowAnalysisesState };
        const flowAnalysisId = state.flowanalysises.flowanalysis?.id;
        
        if (flowAnalysisId) {
            const response = await api.flowAnalyses.flowAnalysesRead(flowAnalysisId.toString());
            dispatch(setFlowAnalysis(response.data));
        }
    }
);

export const fetchFlowAnalyses = createAsyncThunk(
    'flowanalyses/fetchFlowAnalyses',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const filters = state.flowanalysises.filters;
        
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') {
            params.append('status', filters.status);
        }
        if (filters.date_start) {
            params.append('date_start', filters.date_start);
        }
        if (filters.date_end) {
            params.append('date_end', filters.date_end);
        }
        
        const response = await api.flowAnalyses.flowAnalysesList(params.toString());
        return response.data;
    }
);

export const updateFlowAnalysis = createAsyncThunk<T_FlowAnalysis, T_FlowAnalysis>(
    "flowanalysises/updateFlowAnalysis",
    async (flowanalysis) => {
        const response = await api.flowAnalyses.flowAnalysesUpdateUpdate(flowanalysis.id.toString(), flowanalysis);
        return response.data;
    }
);

export const fetchCurrentFlowAnalysis = createAsyncThunk<T_FlowAnalysis, string>(
    "flowanalysises/fetchCurrentFlowAnalysis",
    async (id) => {
        const response = await api.flowAnalyses.flowAnalysesRead(id);
        return response.data;
    }
);

export const removeStationFromFlowAnalysis = createAsyncThunk<void, { stationId: string }>(
    "flowanalysises/removeStationFromFlowAnalysis",
    async ({ stationId }, { getState, dispatch }) => {
        try {
            const state = getState() as { flowanalysises: FlowAnalysisesState };
            const flowAnalysisId = state.flowanalysises.flowanalysis?.id;
            
            await api.flowAnalyses.flowAnalysesDeleteStationDelete(stationId);
            
            if (flowAnalysisId) {
                // Обновляем данные текущего анализа
                await dispatch(fetchCurrentFlowAnalysis(flowAnalysisId.toString()));
                // Обновляем список станций, чтобы обновить информацию о черновике
                await dispatch(getStationsByName(""));
            }
        } catch (error) {
            console.error("Ошибка при удалении станции из анализа:", error);
            throw error;
        }
    }
);

export const updateStationInFlowAnalysis = createAsyncThunk<void, { stationId: string; visits: number }>(
    "flowanalysises/updateStationInFlowAnalysis",
    async ({ stationId, visits }, { getState }) => {
        const state = getState() as { flowanalysises: FlowAnalysisesState };
        const flowanalysis = state.flowanalysises.flowanalysis;

        if (flowanalysis) {
            await api.flowAnalyses.flowAnalysesUpdateStationUpdate(
                flowanalysis.id.toString(),
                stationId,
                { flow: visits }
            );
        }
    }
);

export const deleteFlowAnalysis = createAsyncThunk<void, string>(
    "flowanalysises/deleteFlowAnalysis",
    async (id) => {
        await api.flowAnalyses.flowAnalysesDeleteDelete(id);
    }
);

export const updateFilters = createAsyncThunk<void, { status: string; date_start: string; date_end: string }>(
    "flowanalysises/updateFilters",
    async (filters, { dispatch }) => {
        dispatch(setFilters(filters));
    }
);

export const addStationToFlowAnalysis = createAsyncThunk<void, { stationId: string }>(
    "flowanalysises/addStationToFlowAnalysis",
    async ({ stationId }) => {
        try {
            console.log('7. Начало addStationToFlowAnalysis в slice, stationId:', stationId);
            await api.flowAnalyses.flowAnalysesAddStationCreate(stationId);
            console.log('8. Успешно вызван API метод');
            await api.stations.stationsList();
            console.log('9. Успешно обновлен список станций');
        } catch (error) {
            console.error("10. Ошибка в slice при добавлении станции:", error);
            throw error;
        }
    }
);

export const updateStationOrder = createAsyncThunk<void, { stationId: string; order: number }>(
    "flowanalysises/updateStationOrder",
    async ({ stationId, order }, { getState, dispatch }) => {
        try {
            console.log('5. Начало updateStationOrder в slice');
            const state = getState() as { flowanalysises: FlowAnalysisesState };
            const flowAnalysisId = state.flowanalysises.flowanalysis?.id;
            
            console.log('6. flowAnalysisId:', flowAnalysisId);
            if (flowAnalysisId) {
                console.log('7. Вызов API метода с параметрами:', {
                    flowAnalysisId: flowAnalysisId.toString(),
                    stationId,
                    order
                });
                await api.flowAnalyses.flowAnalysesUpdateStationUpdate(
                    flowAnalysisId.toString(),
                    stationId,
                    { order }
                );
                console.log('8. Успешный вызов API');
                await dispatch(fetchCurrentFlowAnalysis(flowAnalysisId.toString()));
                console.log('9. Данные обновлены');
            }
        } catch (error) {
            console.error('10. Ошибка в slice:', error);
            throw error;
        }
    }
);

export const formFlowAnalysis = createAsyncThunk<void, string>(
    "flowanalysises/formFlowAnalysis",
    async (id) => {
        try {
            await api.flowAnalyses.flowAnalysesFormUpdate(id);
        } catch (error) {
            console.error('Error forming flow analysis:', error);
            throw error;
        }
    }
);

const flowanalysisesSlice = createSlice({
    name: "flowanalysises",
    initialState,
    reducers: {
        setFlowAnalysis: (state, action: PayloadAction<T_FlowAnalysis>) => {
            state.flowanalysis = action.payload;
        },
        setFilters: (state, action: PayloadAction<{ status: string; date_start: string; date_end: string }>) => {
            state.filters = action.payload;
        },
        removeFlowAnalysis: (state) => {
            state.flowanalysis = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFlowAnalysis.fulfilled, (state, action: PayloadAction<T_FlowAnalysis>) => {
            state.flowanalysis = action.payload;
        });
        builder.addCase(fetchFlowAnalyses.fulfilled, (state, action: PayloadAction<T_FlowAnalysis[]>) => {
            state.flowanalyses = action.payload;
        });
        builder.addCase(deleteFlowAnalysis.fulfilled, (state, action) => {
            state.flowanalysis = null;
            state.flowanalyses = state.flowanalyses.filter(fa => fa.id.toString() !== action.meta.arg);
        });
        builder.addCase(getFlowAnalysisById.fulfilled, (state, action: PayloadAction<T_FlowAnalysis>) => {
            state.flowanalysis = action.payload;
        });
        builder.addCase(fetchCurrentFlowAnalysis.fulfilled, (state, action) => {
            state.flowanalysis = action.payload;
        });
    }
});

export const { setFlowAnalysis, setFilters, removeFlowAnalysis } = flowanalysisesSlice.actions;

export default flowanalysisesSlice.reducer;