const { Router } = require("express");
const hotelBookingController = require("../controller/HotelController/hotelBookingController");
const hotelController = require("../controller/HotelController/hotelController");
const { isAuth, isAdmin, isSuperAdmin } = require("../middleware/loginPassportMiddleware");
const hotelValidation = require("../middleware/hotelMiddleware");
const validationResultFun = require("../middleware/validationFun");
const hotelBookingMiddleware = require("../middleware/hotelBookingMiddleware");
const deleteHotelController = require("../controller/HotelController/deleteHotelController");
const cancellingHotelBookingController = require("../controller/HotelController/cancellingHotelBookingController");
const updateHotelController = require("../controller/HotelController/updateHotelController");
const deleteHotelBookingController = require("../controller/HotelController/deleteHotelBookingController");
const hotelRecordsController = require("../controller/HotelController/hotelRecordsController");
const uploads = require("../utils/hotelImagesUpload");
const hotelReviewMiddleware = require("../middleware/hotelReviewMiddleware");
const hotelReviewController = require("../controller/HotelController/hotelReviewsController");
const { hotelImageMiddleware, deleteHotelImageMiddleware, deleteCustomeImageMiddleware } = require("../middleware/hotelImageMiddleware");
const hotelImageController = require("../controller/HotelController/hotelImageController");
const deleteAllHotelImageController = require("../controller/HotelController/deleteAllHotelImageController");
const deleteCustomeImageController = require("../controller/HotelController/deleteCustomeImageController");
const verifyHotelController = require("../controller/HotelController/verifyHotelController");
const verifyHotelMiddleware = require("../middleware/verifyHotelMiddleware");
const updateHotelMiddleware = require("../middleware/updateHotelMiddleware");
const { hotelInfoController, hotelInfoVerifyController } = require("../controller/HotelController/hotelInfoController");
const { deleteMiddleware, userCancelMiddleware } = require("../middleware/deleteMiddleware");
const singleHotelController = require("../controller/HotelController/singleHotelController");
const propertyGetController = require("../controller/HotelController/propertyGetController");
const hotelBookingGetController = require("../controller/HotelController/hotelBookingGetController");
const route = Router();

route.post("/gethotels", isAuth, hotelRecordsController);

route.get("/get-all-hotels", isAuth, hotelInfoController);
route.get("/get-hotels/verify", isAuth, isSuperAdmin, hotelInfoVerifyController);

route.get("/:hotel_id", isAuth, singleHotelController);

route.get("/property/get-property", isAuth, isAdmin, propertyGetController);

route.get("/hotel-booking/get-hotel-booking", isAuth, hotelBookingGetController);

/**
 * @swagger
 * /hotel/hotel-booking:
 *   post:
 *     summary: Book a hotel room
 *     description: Allows a user to book a hotel room by providing necessary details such as check-in and check-out dates, number of rooms, and total price.
 *     tags:
 *       - Hotel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: integer
 *                 description: The ID of the hotel to be booked.
 *               check_in_date:
 *                 type: string
 *                 format: date
 *                 description: The check-in date for the hotel booking.
 *               check_out_date:
 *                 type: string
 *                 format: date
 *                 description: The check-out date for the hotel booking.
 *               number_of_rooms:
 *                 type: integer
 *                 description: The number of rooms to be booked.
 *               total_price:
 *                 type: number
 *                 format: float
 *                 description: The total price for the booking, calculated based on price per night and number of rooms.
 *             required:
 *               - hotel_id
 *               - check_in_date
 *               - check_out_date
 *               - number_of_rooms
 *               - total_price
 *     responses:
 *       202:
 *         description: Hotel booking was successfully created.
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created booking.
 *                 user_id:
 *                   type: integer
 *                   description: The ID of the user who made the booking.
 *                 hotel_id:
 *                   type: integer
 *                   description: The ID of the booked hotel.
 *                 check_in_date:
 *                   type: string
 *                   format: date
 *                   description: The check-in date for the booking.
 *                 check_out_date:
 *                   type: string
 *                   format: date
 *                   description: The check-out date for the booking.
 *                 number_of_rooms:
 *                   type: integer
 *                   description: The number of rooms booked.
 *                 total_price:
 *                   type: number
 *                   format: float
 *                   description: The total price for the booking.
 *       400:
 *         description: Invalid input data or booking creation failure.
 *       500:
 *         description: Internal server error or unexpected error during booking.
 */

route.post("/hotel-booking", isAuth, hotelBookingMiddleware(), validationResultFun, hotelBookingController);

/**
 * @swagger
 * /hotel/add-hotel:
 *   post:
 *     summary: Add a new hotel
 *     description: Allows an authenticated user to add a new hotel with details like name, location, address, country, price per night, available rooms, and services.
 *     tags:
 *       - Hotel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hotel.
 *               location:
 *                 type: string
 *                 description: The location of the hotel.
 *               address:
 *                 type: string
 *                 description: The address of the hotel.
 *               country:
 *                 type: string
 *                 description: The country where the hotel is located.
 *               price_per_night:
 *                 type: number
 *                 format: float
 *                 description: The price per night for booking a room.
 *               available_rooms:
 *                 type: integer
 *                 description: The number of available rooms in the hotel.
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of services offered by the hotel.
 *             required:
 *               - name
 *               - location
 *               - address
 *               - country
 *               - price_per_night
 *               - available_rooms
 *               - services
 *     responses:
 *       202:
 *         description: Hotel successfully added.
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created hotel.
 *                 owner_id:
 *                   type: integer
 *                   description: The ID of the user who added the hotel.
 *                 name:
 *                   type: string
 *                   description: The name of the hotel.
 *                 location:
 *                   type: string
 *                   description: The location of the hotel.
 *                 address:
 *                   type: string
 *                   description: The address of the hotel.
 *                 country:
 *                   type: string
 *                   description: The country where the hotel is located.
 *                 price_per_night:
 *                   type: number
 *                   format: float
 *                   description: The price per night for booking a room.
 *                 available_rooms:
 *                   type: integer
 *                   description: The number of available rooms in the hotel.
 *                 services:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of services offered by the hotel.
 *       400:
 *         description: Invalid input data or failed to add hotel.
 *       500:
 *         description: Internal server error or unexpected error while adding the hotel.
 */

route.post("/add-hotel", isAuth, isAdmin, uploads.array("hotel_img"), hotelValidation(), validationResultFun, hotelController);

// Verify Hotel Entry

route.patch("/verify-hotel", isAuth, isSuperAdmin, verifyHotelMiddleware(), validationResultFun, verifyHotelController)

route.delete("/delete-hotel-image", isAuth, isAdmin, deleteHotelImageMiddleware(), validationResultFun, deleteAllHotelImageController);

// Add More Images (into existing)

route.post("/add-hotel-images", isAuth, isAdmin, uploads.array("hotel_img"),
    hotelImageMiddleware(), validationResultFun, hotelImageController
);

// Deleting Single Image from exiting multiple images

route.delete("/delete-custome-image", isAuth, isAdmin, deleteCustomeImageMiddleware(), validationResultFun, deleteCustomeImageController)

/**
 * @swagger
 * /hotel/delete-hotel-info:
 *   delete:
 *     summary: Delete a hotel's information
 *     description: Allows an authenticated user to mark a hotel's information as deleted by setting the `is_deleted` field to `true`. Only the owner of the hotel can delete their hotel.
 *     tags:
 *       - Hotel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Hotel information successfully marked as deleted.
 *       400:
 *         description: Invalid input data or failed to delete hotel information.
 *       401:
 *         description: Unauthorized. Only the owner of the hotel can delete the hotel.
 *       500:
 *         description: Internal server error or unexpected error while deleting the hotel information.
 */

route.delete("/delete-hotel-info", isAuth, isAdmin, deleteMiddleware("hotel_id"), validationResultFun, deleteHotelController);

/**
 * @swagger
 * /hotel/canceling-hotel-booking:
 *   patch:
 *     summary: Cancel a hotel booking
 *     description: Allows an authenticated user to cancel their hotel booking. Updates the booking status to `false` and sends a cancellation notification to the user.
 *     tags:
 *       - Hotel Booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Hotel booking successfully cancelled.
 *       400:
 *         description: Invalid request or failed to cancel the booking.
 *       401:
 *         description: Unauthorized. Only the user who made the booking can cancel it.
 *       500:
 *         description: Internal server error or unexpected error during booking cancellation.
 */

route.patch("/canceling-hotel-booking", isAuth, userCancelMiddleware("hotel_id"), validationResultFun, cancellingHotelBookingController);

/**
 * @swagger
 * /hotel/deleting-hotel-booking:
 *   delete:
 *     summary: Delete a hotel booking
 *     description: Allows an authenticated user to delete their hotel booking. Only the owner of the hotel can delete bookings associated with their hotel.
 *     tags:
 *       - Hotel Booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Hotel booking successfully deleted.
 *       400:
 *         description: Invalid request or failed to delete the booking.
 *       403:
 *         description: Forbidden. User is not authorized to delete the booking.
 *       500:
 *         description: Internal server error or unexpected error during deletion.
 */

route.delete("/deleting-hotel-booking", isAuth, isAdmin, userCancelMiddleware("hotel_id"), validationResultFun, deleteHotelBookingController);

/**
 * @swagger
 * /hotel/update-hotel-info:
 *   put:
 *     summary: Update hotel information
 *     description: Allows the owner to update the details of their hotel, such as name, location, price, available rooms, and services.
 *     tags:
 *       - Hotel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the hotel.
 *               location:
 *                 type: string
 *                 description: The location of the hotel.
 *               count:
 *                 type: integer
 *                 description: The count of available rooms.
 *               price_per_night:
 *                 type: number
 *                 format: float
 *                 description: The price per night for staying at the hotel.
 *               available_rooms:
 *                 type: integer
 *                 description: The number of rooms currently available.
 *               services:
 *                 type: string
 *                 description: A list of services offered by the hotel.
 *             required:
 *               - name
 *               - location
 *               - price_per_night
 *               - available_rooms
 *     responses:
 *       202:
 *         description: Hotel information successfully updated.
 *       400:
 *         description: Invalid input data or failed to update hotel information.
 *       403:
 *         description: Forbidden. User is not authorized to update this hotel information.
 *       500:
 *         description: Internal server error or unexpected error while updating hotel information.
 */

route.put("/update-hotel-info", isAuth, isAdmin, updateHotelMiddleware(), validationResultFun, updateHotelController);

route.post("/add-hotel-reviews/:hotel_id", isAuth, hotelReviewMiddleware(), validationResultFun, hotelReviewController);

module.exports = route;
