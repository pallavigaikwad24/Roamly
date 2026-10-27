import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filters: {
        departure_airport: '',
        destination_airport: '',
        startDate: '',
        total_seats: 0,
    },
    isOptionSelect: "flight",
    searchQueryDeparture: '',
    searchQueryDestination: '',
}

const searchHotelSlice = createSlice({
    name: 'searchFlight',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload
        },
        setIsOptionSelect: (state, action) => {
            state.isOptionSelect = action.payload
        },
        setSearchQueryDeparture: (state, action) => {
            state.searchQueryDeparture = action.payload
        },
        setSearchQueryDestination: (state, action) => {
            state.searchQueryDestination = action.payload
        },
    }
});

export const { setSearchQueryDestination, setSearchQueryDeparture, setFilters, setIsOptionSelect } = searchHotelSlice.actions;
export default searchHotelSlice.reducer;