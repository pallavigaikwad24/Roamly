const { Router } = require("express");
const validationResultFun = require("../middleware/validationFun");
const hotelSearchController = require("../controller/HotelController/hotelSearchController");
const hotelSearchMiddleware = require("../middleware/hotelSearchMiddleware");
const flightSearchMiddleware = require("../middleware/flightSearchMiddleware");
const flightSearchController = require("../controller/FlightController/flightSearchController");
const priceSortFilterController = require("../controller/HotelController/priceSortFilterController");
const customFilterHotelController = require("../controller/HotelController/customFilterHotelController");
const priceFilterMiddleware = require("../middleware/priceFilterMiddleware");
const customHotelFilterMiddleware = require("../middleware/customHotelFilterMiddleware");
const hotelListMiddleware = require("../middleware/hotelListMiddleware");
const hotelListController = require("../controller/HotelController/hotelListController");
const flightListController = require("../controller/FlightController/flightListController");

const route = Router();

/**
 * @swagger
 * /search/hotels:
 *   post:
 *     summary: Search for hotels by name
 *     description: Allows users to search for hotels by their name. Returns all hotels that match the search query and are not marked as deleted.
 *     tags:
 *       - Hotel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *       application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hotel to search for.
 *             required:
 *               - name
 *     responses:
 *       202:
 *         description: Hotels successfully retrieved based on search query.
 *         content:
 *         application/x-www-form-urlencoded:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the hotel.
 *                   name:
 *                     type: string
 *                     description: The name of the hotel.
 *                   address:
 *                     type: string
 *                     description: The address of the hotel.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price per night at the hotel.
 *                   rating:
 *                     type: number
 *                     description: The rating of the hotel.
 *                   is_deleted:
 *                     type: boolean
 *                     description: Whether the hotel is deleted or not.
 *       400:
 *         description: Invalid input or failed to retrieve hotel information.
 *       500:
 *         description: Internal server error while searching for hotels.
 */

route.post("/hotels", hotelSearchMiddleware(), validationResultFun, hotelSearchController);

route.post("/hotel-list", hotelListMiddleware(), validationResultFun, hotelListController);

/**
 * @swagger
 * /search/flight:
 *   post:
 *     summary: Search for flights by departure and destination airports
 *     description: Allows users to search for flights by specifying departure and destination airports. Returns all flights that match the search criteria and are not marked as deleted.
 *     tags:
 *       - Flight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *       application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               departure_airport:
 *                 type: string
 *                 description: The airport from which the flight departs.
 *               destination_airport:
 *                 type: string
 *                 description: The airport where the flight arrives.
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The starting date for searching flights.
 *             required:
 *               - departure_airport
 *               - destination_airport
 *               - start_date
 *     responses:
 *       202:
 *         description: Flights successfully retrieved based on search query.
 *         content:
 *         application/x-www-form-urlencoded:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the flight.
 *                   flight_number:
 *                     type: string
 *                     description: The flight number.
 *                   airline:
 *                     type: string
 *                     description: The airline operating the flight.
 *                   departure_airport:
 *                     type: string
 *                     description: The departure airport.
 *                   arrival_airport:
 *                     type: string
 *                     description: The destination airport.
 *                   departure_date:
 *                     type: string
 *                     format: date
 *                     description: The departure date of the flight.
 *                   departure_time:
 *                     type: string
 *                     format: time
 *                     description: The departure time of the flight.
 *                   arrival_date:
 *                     type: string
 *                     format: date
 *                     description: The arrival date of the flight.
 *                   arrival_time:
 *                     type: string
 *                     format: time
 *                     description: The arrival time of the flight.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the flight.
 *                   seats_available:
 *                     type: integer
 *                     description: The number of seats available for booking.
 *                   is_deleted:
 *                     type: boolean
 *                     description: Whether the flight is deleted or not.
 *       400:
 *         description: Invalid input or failed to retrieve flight information.
 *       500:
 *         description: Internal server error while searching for flights.
 */

route.post("/flights", flightSearchMiddleware(), validationResultFun, flightSearchController);

route.post("/flight-list", flightListController);

route.post("/filter", priceFilterMiddleware(), validationResultFun, priceSortFilterController);

route.post("/custom-filter", customHotelFilterMiddleware(), validationResultFun, customFilterHotelController);

module.exports = route;