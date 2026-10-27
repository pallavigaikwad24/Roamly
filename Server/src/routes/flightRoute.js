const { Router } = require("express");
const flightController = require("../controller/FlightController/flightController");
const flightBookingController = require("../controller/FlightController/flightBookingController");
const { isAuth, isAdmin, isSuperAdmin } = require("../middleware/loginPassportMiddleware");
const flightMiddleware = require("../middleware/flightMiddleware");
const flightBookingMiddleware = require("../middleware/flightBookingMiddleware");
const validationResultFun = require("../middleware/validationFun");
const deleteFlightController = require("../controller/FlightController/deleteFlightController");
const cancellingFlightBookingController = require("../controller/FlightController/cancellingFlightBookingController");
const deleteFlightBookingController = require("../controller/FlightController/deleteFlightBookingController");
const updateFlightController = require("../controller/FlightController/updateFlightController");
const flightInfoController = require("../controller/FlightController/flightInfoController");
const { deleteMiddleware, userCancelMiddleware } = require("../middleware/deleteMiddleware");

const route = Router();

route.get("/get-all-flights", isSuperAdmin, flightInfoController);

/**
 * @swagger
 * /flight/add-flight:
 *   post:
 *     summary: Add a new flight
 *     description: Allows the owner to add a new flight to the system, providing flight details such as flight number, airline, departure and arrival details, and seat availability.
 *     tags:
 *       - Flight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               flight_number:
 *                 type: string
 *                 description: The flight number.
 *               airline:
 *                 type: string
 *                 description: The name of the airline operating the flight.
 *               departure_airport:
 *                 type: string
 *                 description: The airport from which the flight departs.
 *               arrival_airport:
 *                 type: string
 *                 description: The airport at which the flight arrives.
 *               departure_date:
 *                 type: string
 *                 format: date
 *                 description: The date when the flight departs.
 *               departure_time:
 *                 type: string
 *                 format: time
 *                 description: The time when the flight departs.
 *               arrival_date:
 *                 type: string
 *                 format: date
 *                 description: The date when the flight arrives.
 *               arrival_time:
 *                 type: string
 *                 format: time
 *                 description: The time when the flight arrives.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price for a seat on the flight.
 *               seats_available:
 *                 type: integer
 *                 description: The number of seats available for booking.
 *             required:
 *               - flight_number
 *               - airline
 *               - departure_airport
 *               - arrival_airport
 *               - departure_date
 *               - departure_time
 *               - arrival_date
 *               - arrival_time
 *               - price
 *               - seats_available
 *     responses:
 *       202:
 *         description: Flight successfully added.
 *       400:
 *         description: Invalid input or failed to add flight.
 *       500:
 *         description: Internal server error while adding flight information.
 */

route.post("/add-flight", isAuth, isAdmin, flightMiddleware(), validationResultFun, flightController);

/**
 * @swagger
 * /flight/flight-booking:
 *   post:
 *     summary: Book a flight
 *     description: Allows the user to book a flight by providing flight details such as the flight ID, number of seats, and total price.
 *     tags:
 *       - Flight Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               flight_id:
 *                 type: integer
 *                 description: The ID of the flight to be booked.
 *               number_of_seats:
 *                 type: integer
 *                 description: The number of seats to book for the flight.
 *               total_price:
 *                 type: number
 *                 format: float
 *                 description: The total price for the booked seats.
 *             required:
 *               - flight_id
 *               - number_of_seats
 *               - total_price
 *     responses:
 *       202:
 *         description: Flight booking successfully created.
 *       400:
 *         description: Invalid input or failed to process the booking.
 *       500:
 *         description: Internal server error while processing flight booking.
 */

route.post("/flight-booking", isAuth, flightBookingMiddleware(), validationResultFun, flightBookingController);

/**
 * @swagger
 * /flight/delete-flight-info:
 *   delete:
 *     summary: Delete a flight
 *     description: Allows the owner to delete a flight from the system by marking it as deleted. Only the owner of the flight can perform this action.
 *     tags:
 *       - Flight
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Flight successfully deleted.
 *       400:
 *         description: Failed to delete flight information due to an internal error or invalid request.
 *       403:
 *         description: Forbidden. The user is not authorized to delete the flight.
 */

route.delete("/delete-flight-info", isAuth, isAdmin, deleteMiddleware("flight_id"), validationResultFun, deleteFlightController);

/**
 * @swagger
 * /flight/canceling-flight-booking:
 *   patch:
 *     summary: Cancel a flight booking
 *     description: Allows the user to cancel their flight booking by updating the booking status to false.
 *     tags:
 *       - Flight Booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Flight booking successfully cancelled.
 *       400:
 *         description: Invalid request or failed to cancel flight booking.
 *       403:
 *         description: Forbidden. The user is not authorized to cancel the booking.
 */

route.patch("/canceling-flight-booking", isAuth, userCancelMiddleware("flight_id"), validationResultFun, cancellingFlightBookingController);

/**
 * @swagger
 * /flight/deleting-flight-booking:
 *   delete:
 *     summary: Delete a flight booking
 *     description: Allows the owner to delete a flight booking by updating its status to "deleted". Only the owner of the flight can delete bookings for it.
 *     tags:
 *       - Flight Booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Flight booking successfully deleted.
 *       400:
 *         description: Invalid request or failed to delete the flight booking.
 *       403:
 *         description: Forbidden. The user is not authorized to delete the booking.
 *       404:
 *         description: Flight not found for the user.
 */

route.delete("/deleting-flight-booking", isAuth, isAdmin, userCancelMiddleware("flight_id"), validationResultFun, deleteFlightBookingController);

/**
 * @swagger
 * /flight/update-flight-info:
 *   put:
 *     summary: Update flight information
 *     description: Allows the owner to update details of an existing flight, including flight number, airline, departure and arrival details, price, and available seats.
 *     tags:
 *       - Flight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               flight_number:
 *                 type: string
 *                 description: The flight number of the flight.
 *               airline:
 *                 type: string
 *                 description: The name of the airline operating the flight.
 *               departure_airport:
 *                 type: string
 *                 description: The airport where the flight departs from.
 *               arrival_airport:
 *                 type: string
 *                 description: The airport where the flight arrives at.
 *               departure_date:
 *                 type: string
 *                 format: date
 *                 description: The date when the flight departs.
 *               departure_time:
 *                 type: string
 *                 format: time
 *                 description: The time when the flight departs.
 *               arrival_date:
 *                 type: string
 *                 format: date
 *                 description: The date when the flight arrives.
 *               arrival_time:
 *                 type: string
 *                 format: time
 *                 description: The time when the flight arrives.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price per seat on the flight.
 *               seats_available:
 *                 type: integer
 *                 description: The number of available seats on the flight.
 *             required:
 *               - flight_number
 *               - airline
 *               - departure_airport
 *               - arrival_airport
 *               - departure_date
 *               - departure_time
 *               - arrival_date
 *               - arrival_time
 *               - price
 *               - seats_available
 *     responses:
 *       202:
 *         description: Flight information successfully updated.
 *       400:
 *         description: Invalid input or failed to update flight information.
 *       500:
 *         description: Internal server error while updating flight information.
 */

route.put("/update-flight-info", isAuth, flightMiddleware(), validationResultFun, updateFlightController)

module.exports = route;