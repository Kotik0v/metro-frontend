import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_FlowAnalysis } from "../../modules/types";
import { api } from "../../api";

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
    "flowanalysises/getFlowAnalysisById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.flowAnalyses.flowAnalysesRead(id);
            return response.data;
        } catch (error) {
            return rejectWithValue('Произошла ошибка');
        }
    }
);

export const fetchFlowAnalysis = createAsyncThunk<T_FlowAnalysis, string>(
    "flowanalysises/fetchFlowAnalysis",
    async (id) => {
        const response = await api.flowAnalyses.flowAnalysesRead(id);
        return response.data;
    }
);

export const fetchFlowAnalyses = createAsyncThunk<T_FlowAnalysis[], void>(
    "flowanalysises/fetchFlowAnalyses",
    async () => {
        const response = await api.flowAnalyses.flowAnalysesList();
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

export const removeStationFromFlowAnalysis = createAsyncThunk<void, { stationId: string }>(
    "flowanalysises/removeStationFromFlowAnalysis",
    async ({ stationId }, { getState }) => {
        const state = getState() as { flowanalysises: FlowAnalysisesState };
        const flowanalysis = state.flowanalysises.flowanalysis;

        if (flowanalysis) {
            await api.flowAnalyses.flowAnalysesDeleteStationDelete(flowanalysis.id.toString(), stationId);
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
    }
});

export const { setFlowAnalysis, setFilters, removeFlowAnalysis } = flowanalysisesSlice.actions;

export default flowanalysisesSlice.reducer;