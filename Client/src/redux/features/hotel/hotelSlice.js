import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hotelList: null,
    isHotelList: true,
    searchHotelInfo: null,
    hotelInfo: null,
    allHotelInfo: null,
    showForm: false,
    isSearchRoute: false
}

const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        setHotelList: (state, action) => {
            state.hotelList = action.payload
        },
        removeHotelList: (state) => {
            state.hotelList = null
        },
        setIsHotelList: (state) => {
            state.isHotelList = false;
        },
        setSearchHotelInfo: (state, action) => {
            state.searchHotelInfo = action.payload
        },
        setHotelInfo: (state, action) => {
            state.hotelInfo = action.payload
        },
        setAllHotelInfo: (state, action) => {
            state.allHotelInfo = action.payload
        },
        setShowForm: (state) => {
            state.showForm = true
        },
        hideForm: (state) => {
            state.showForm = false
        },
        setIsSearchRoute: (state) => {
            state.isSearchRoute = true
        },
    }
});

export const { setHotelList, setIsHotelList, setSearchHotelInfo, setHotelInfo, setAllHotelInfo,
    removeHotelList, setShowForm, hideForm, setIsSearchRoute } = hotelSlice.actions;
export default hotelSlice.reducer;