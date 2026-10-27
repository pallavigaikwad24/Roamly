import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flightList: null,
    isflightList: true,
    searchflightInfo: null,
    flightInfo: null
}

const flightSlice = createSlice({
    name: 'flight',
    initialState,
    reducers: {
        setflightList: (state, action) => {
            state.flightList = action.payload
        },
        removeFlightList: (state) => {
            state.flightList = null
        },
        setIsflightList: (state) => {
            state.isflightList = false;
        },
        setIsflightListTrue: (state) => {
            state.isflightList = true;
        },
        setSearchflightInfo: (state, action) => {
            state.searchflightInfo = action.payload
        },
        setflightInfo: (state, action) => {
            state.flightInfo = action.payload
        }
    }
});

export const { setflightList, setIsflightList, setIsflightListTrue, setSearchflightInfo, setflightInfo, removeFlightList } = flightSlice.actions;
export default flightSlice.reducer;