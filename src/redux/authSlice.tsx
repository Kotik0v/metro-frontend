import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!sessionStorage.getItem('username'),
    username: sessionStorage.getItem('username')
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ username: string }>) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
            sessionStorage.setItem('username', action.payload.username);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = null;
            sessionStorage.removeItem('username');
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;