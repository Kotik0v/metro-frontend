import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_LoginCredentials, T_RegisterCredentials, T_User } from "../../modules/types";
import { api } from "../../api";

const initialState: T_User = {
    id: -1,
    username: "",
    email: "",
    password: "",
    is_authenticated: false,
    validation_error: false,
    validation_success: false,
    checked: false,
    first_name: "",
    last_name: ""
};

export const handleLogin = createAsyncThunk<T_User, T_LoginCredentials>(
    "user/login",
    async ({ username, password }) => {
        const response = await api.users.usersLoginCreate({ username, password });
        return response.data;
    }
);

export const handleRegister = createAsyncThunk<T_User, T_RegisterCredentials>(
    "user/register",
    async ({ username, email, password, first_name, last_name }) => {
        const response = await api.users.usersRegisterCreate({ username, email, password, first_name, last_name });
        return response.data;
    }
);

export const handleLogout = createAsyncThunk<void>(
    "user/logout",
    async () => {
        await api.users.usersLogoutCreate();
    }
);

export const handleUpdateProfile = createAsyncThunk<T_User, T_RegisterCredentials>(
    "user/updateProfile",
    async ({ username, email, password, first_name, last_name }) => {
        const response = await api.users.usersUpdateUpdate({ username, email, password, first_name, last_name });
        return response.data;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setValidationError: (state, action: PayloadAction<boolean>) => {
            state.validation_error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state, action: PayloadAction<T_User>) => {
            Object.assign(state, action.payload, { is_authenticated: true });
        });
        builder.addCase(handleLogout.fulfilled, (state) => {
            Object.assign(state, initialState);
        });
        builder.addCase(handleRegister.fulfilled, (state, action: PayloadAction<T_User>) => {
            Object.assign(state, action.payload, { is_authenticated: true });
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state, action: PayloadAction<T_User>) => {
            Object.assign(state, action.payload);
        });
    }
});

export const { setValidationError } = userSlice.actions;

export default userSlice.reducer;