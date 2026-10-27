import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchQuery: '',
    filters: {
        search: '',
        startDate: '',
        endDate: '',
        travelers: 0,
    },
    isOptionSelect: "hotel"
}

const searchHotelSlice = createSlice({
    name: 'searchHotel',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },
        setFilters: (state, action) => {
            state.filters = action.payload
        },
        setIsOptionSelect: (state, action) => {
            state.isOptionSelect = action.payload
        }
    }
});

export const { setSearchQuery, setFilters, setIsOptionSelect } = searchHotelSlice.actions;
export default searchHotelSlice.reducer;