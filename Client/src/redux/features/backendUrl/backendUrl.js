import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    url: import.meta.env.VITE_BACKEND_URL,
    countryList: null
}

const searchHotelSlice = createSlice({
    name: 'backendUrl',
    initialState,
    reducers: {
        setCountryList: (state, action) => {
            state.countryList = action.payload;
        }
    }
});

export const { setCountryList } = searchHotelSlice.actions;

export default searchHotelSlice.reducer;