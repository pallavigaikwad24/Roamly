import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: localStorage.getItem("user_login")
}

const protectedSlice = createSlice({
    name: 'protected',
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem("user_login", action.payload);
            state.isAuthenticated = localStorage.getItem("user_login")
        },
        logout: () => {
            localStorage.removeItem("user_login");
        },
    }
});

export const { login, logout } = protectedSlice.actions;
export default protectedSlice.reducer;