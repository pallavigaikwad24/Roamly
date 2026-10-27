import { configureStore } from "@reduxjs/toolkit";
import loginReducer from '../features/auth/loginSlice';
import searchHotelReducer from '../features/search/searchHotelSlice';
import searchFlightReducer from '../features/search/searchFlightSlice';
import backendUrlReducer from '../features/backendUrl/backendUrl';
import hotelReducer from '../features/hotel/hotelSlice';
import flightReducer from '../features/flight/flightSlice';
import protectedRouteReducer from '../features/protectedRoute/protectedRouteSlice';

const store = configureStore({
    reducer: {
        login: loginReducer,
        searchHotel: searchHotelReducer,
        searchFlight: searchFlightReducer,
        backendUrl: backendUrlReducer,
        hotel: hotelReducer,
        flight: flightReducer,
        protected: protectedRouteReducer
    }
});

export default store;