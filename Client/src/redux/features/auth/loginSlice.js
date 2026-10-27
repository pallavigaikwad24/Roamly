import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    error: '',
    alertView: false,
    showPassword: false,
    showOtp: false,
    email: null
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        showAlert: (state) => {
            state.alertView = true
        },
        hideAlert: (state) => {
            state.alertView = false
        },
        showError: (state, action) => {
            state.error = action.payload;
        },
        showPassword: (state) => {
            state.showPassword = true
        },
        setShowOtpTrue: (state) => {
            state.showOtp = true
        },
        setShowOtpFalse: (state) => {
            state.showOtp = false
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
    }
});

export const { showAlert, showError, showPassword, hideAlert, setShowOtpTrue, setShowOtpFalse, setEmail } = loginSlice.actions;
export default loginSlice.reducer;