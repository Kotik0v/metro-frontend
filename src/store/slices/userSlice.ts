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
        try {
            const response = await api.users.usersLoginCreate({ 
                username, 
                password 
            });
            return response.data;
        } catch (error) {
            console.error('Login error in slice:', error);
            throw error;
        }
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
        try {
            console.log('Отправка запроса на выход');
            await api.users.usersLogoutCreate();
            // После успешного выхода удаляем sessionid
            document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            console.log('Запрос на выход успешно выполнен');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            // Даже при ошибке удаляем sessionid на клиенте
            document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            throw error;
        }
    }
);

export const handleUpdateProfile = createAsyncThunk<T_User, T_RegisterCredentials>(
    "user/updateProfile",
    async ({ username, email, password, first_name, last_name }) => {
        const response = await api.users.usersUpdateUpdate({ username, email, password, first_name, last_name });
        return response.data;
    }
);

export const checkSession = createAsyncThunk<T_User>(
    "user/checkSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCheckSession();
            return response.data;
        } catch (error: any) {
            // Для 404 ошибки или любой другой возвращаем состояние неавторизованного пользователя
            return rejectWithValue({
                is_authenticated: false,
                username: '',
                email: '',
                first_name: '',
                last_name: ''
            });
        }
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
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.is_authenticated = true;
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state, action: PayloadAction<T_User>) => {
            Object.assign(state, action.payload);
        });
        builder.addCase(checkSession.fulfilled, (state, action: PayloadAction<T_User>) => {
            Object.assign(state, action.payload, { is_authenticated: true });
        });
    }
});

export const { setValidationError } = userSlice.actions;

export default userSlice.reducer;