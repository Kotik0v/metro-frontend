import { configureStore } from "@reduxjs/toolkit";
import stationsReducer from "./slices/stationsSlice";
import userReducer from "./slices/userSlice";
import flowanalysisesReducer from "./slices/flowanalysisesSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        stations: stationsReducer,
        user: userReducer,
        flowanalysises: flowanalysisesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;