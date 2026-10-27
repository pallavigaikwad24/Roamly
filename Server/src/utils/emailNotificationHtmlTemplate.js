const hotelEmailHtml = (customerName, hotelName, guestCount, checkInDate, checkOutDate, totalAmount) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking Confirmation</title>
    <style>
        /* Main email container */
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            color: #444444;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Header section */
        .email-header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #dddddd;
            margin-bottom: 20px;
        }

        .email-header h1 {
            color: #333333;
        }

        /* Body section */
        .email-body {
            padding: 20px;
        }

        .email-body p {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
        }

        .booking-details {
            margin: 20px 0;
            background-color: #ffffff;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .booking-details p {
            margin: 5px 0;
            font-size: 15px;
            color: #333333;
        }

        /* Footer section */
        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #777777;
            padding: 10px 0;
            border-top: 1px solid #dddddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Email Header -->
        <div class="email-header">
            <h1>Booking Confirmation</h1>
        </div>

        <!-- Email Body -->
        <div class="email-body">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for booking with us! Here are your booking details:</p>

            <div class="booking-details">
                <p><strong>Hotel:</strong> ${hotelName}</p>
                <p><strong>Check-in:</strong> ${checkInDate}</p>
                <p><strong>Check-out:</strong> ${checkOutDate}</p>
                <p><strong>Guests:</strong> ${guestCount}</p>
                <p><strong>Total Amount:</strong> ${totalAmount}</p>
            </div>

            <p>If you have any questions or need to modify your booking, feel free to contact us.</p>
        </div>

        <!-- Email Footer -->
        <div class="email-footer">
            <p>Safe travels,</p>
            <p>The ${hotelName} Team</p>
        </div>
    </div>
</body>
</html>
`;

const flightEmailHtml = (passangerName, flightNumber, departureAirport, departureDate,
    departureTime, arrivalAirport, arrivalDate, arrivalTime, totalSeats, totalPrice, airlineName) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flight Booking Confirmation</title>
    <style>
        /* Main email container */
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            color: #444444;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Header section */
        .email-header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #dddddd;
            margin-bottom: 20px;
        }

        .email-header h1 {
            color: #333333;
        }

        /* Body section */
        .email-body {
            padding: 20px;
        }

        .email-body p {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
        }

        .booking-details {
            margin: 20px 0;
            background-color: #ffffff;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .booking-details p {
            margin: 5px 0;
            font-size: 15px;
            color: #333333;
        }

        /* Footer section */
        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #777777;
            padding: 10px 0;
            border-top: 1px solid #dddddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Email Header -->
        <div class="email-header">
            <h1>Flight Booking Confirmation</h1>
        </div>

        <!-- Email Body -->
        <div class="email-body">
            <p>Dear <strong>${passangerName}</strong>,</p>
            <p>Thank you for booking your flight with us! Here are your booking details:</p>

            <div class="booking-details">
                <p><strong>Flight Number:</strong> ${flightNumber}</p>
                <p><strong>Departure:</strong> ${departureAirport} on ${departureDate} at ${departureTime}</p>
                <p><strong>Arrival:</strong> ${arrivalAirport} on ${arrivalDate} at ${arrivalTime}</p>
                <p><strong>Total Seats:</strong> ${totalSeats}</p>
                <p><strong>Total Amount:</strong> ${totalPrice}</p>
            </div>

            <p>If you have any questions or need to modify your booking, feel free to contact us.</p>
        </div>

        <!-- Email Footer -->
        <div class="email-footer">
            <p>Safe travels,</p>
            <p>The ${airlineName} Team</p>
        </div>
    </div>
</body>
</html>
`

module.exports = { hotelEmailHtml, flightEmailHtml };

