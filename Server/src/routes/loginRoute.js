const { Router } = require("express");
const loginController = require("../controller/UserController/loginController");
const loginValidation = require("../middleware/loginMiddleware");
const validationResultFun = require("../middleware/validationFun");
const registrationValidation = require("../middleware/registrationMiddleware");
const registrationController = require("../controller/UserController/registrationController");
const { loginPassportMiddleware, otpPassportMiddleware } = require("../middleware/loginPassportMiddleware");
const emailAuthMiddleware = require("../middleware/emailAuthMiddleware");
const emailAuthController = require("../controller/UserController/emailForgetPasswordController");
const forgetPasswordController = require("../controller/UserController/forgetPasswordController");
const forgetPasswordMiddlware = require("../middleware/forgetPasswordMiddleware");
const emailVerificationController = require("../controller/UserController/emailVerificationController");
const { emailValidation, emailParamValidation } = require("../middleware/otpLoginMiddleware");
const sendOtpController = require("../controller/UserController/sendOtpController");
const logoutController = require("../controller/UserController/logoutController");
const emailVerficationMiddleware = require("../middleware/emailVerificationMiddleware");
const route = Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in an existing user and returns an accepted status.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded::
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Mobile number or Email ID of the user.
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *     responses:
 *       202:
 *         description: User successfully logged in and access granted.
 *       400:
 *         description: Invalid credentials or input data.
 */

route.post("/login", loginValidation(), validationResultFun, loginPassportMiddleware, loginController);

route.post("/send-otp", emailValidation(), validationResultFun, sendOtpController)

route.post("/otp-login/:email", emailParamValidation(), validationResultFun, otpPassportMiddleware, loginController);

/**
 * @swagger
 * /user/registration:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register by providing their personal details and email verification.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user account (hashed before storing).
 *               confirm_password:
 *                 type: string
 *                 description: The password for the user account (hashed before storing).
 *               country:
 *                 type: string
 *                 description: The country of the user.
 *               phone_number:
 *                 type: string
 *                 description: The phone number of the user.
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - confirm_password:
 *               - country
 *               - phone_number
 *     responses:
 *       202:
 *         description: Successfully registered the user. Email verification sent.
 *       400:
 *         description: Invalid input data or registration failure.
 *       500:
 *         description: Internal server error or unexpected error during registration.
 */

route.post("/registration", registrationValidation(), validationResultFun, registrationController);

/**
 * @swagger
 * /user/forgetPassword-email-auth:
 *   post:
 *     summary: Send password reset email
 *     description: Sends a password reset email to the user, allowing them to update their password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting the password reset.
 *     responses:
 *       200:
 *         description: Email successfully sent to the user with a reset link.
 *       400:
 *         description: Invalid email or failed to send email.
 *       500:
 *         description: Internal server error or unexpected error while processing the request.
 */

route.post("/forgetPassword-email-auth", emailAuthMiddleware(), validationResultFun, emailAuthController);

/**
 * @swagger
 * /user/forgetpassword/{token}:
 *   post:
 *     summary: Reset the password for a user
 *     description: This endpoint allows a user to reset their password using a valid token sent to their email.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The password reset token sent to the user's email.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user (hashed before storing).
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password successfully updated.
 *       400:
 *         description: Invalid input data or password reset failure.
 *       404:
 *         description: Token not found or expired.
 *       500:
 *         description: Internal server error during the password reset process.
 */

route.post("/forgetpassword/:token", forgetPasswordMiddlware(), validationResultFun, forgetPasswordController);

/**
 * @swagger
 * /user/email-verification/{token}:
 *   post:
 *     summary: Verify the user's email address
 *     description: This endpoint allows a user to verify their email address by using a valid verification token.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The email verification token sent to the user's email.
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Email successfully verified.
 *       400:
 *         description: Invalid input data or verification failure.
 *       404:
 *         description: Token not found or expired.
 *       500:
 *         description: Internal server error during the email verification process.
 */

route.post("/email-verification/:token", emailVerficationMiddleware(), validationResultFun, emailVerificationController);

route.get("/logout", logoutController);

module.exports = route;