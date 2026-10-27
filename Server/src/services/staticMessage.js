const requiredErrorMessage = (value) => `Please enter ${value}!`;
const validErrorMessage = (value) => `Please enter a valid ${value}!`;
const existErrorMessage = (value, redirect) => `${value} already exists. Please ${redirect} to proceed.`;
const notExistErrorMessage = (value, redirect) => `${value} does not exist, Kindly ${redirect} to proceed.`;
const passwordErrorMessage = (value) => `${value} must be at least 8 characters long and include at least one uppercase letter, 
one lowercase letter, one digit, and one special character.`;
const confirmMatchErrorMessage = (value) => `${value} must match the password.`;
const notAvailableErrorMessage = (value, service) => `${value} ${service} currently unavailable.`;
const availableErrorMessage = (value, service) => `Only ${value} ${service} are currently available.`;
const expireTokenErrorMessage = () => `Your reset password token has expired. Please request a new one to proceed!"`;
const emailverficationMessage = (value, service) => `${value} has been sent for verification. 
Please complete the verification process to confirm your ${service}.`;
const logErrorMessage = (value) => `Error during ${value}!`;
const isEmailVerificationErrorMessage = () => `Your email address is not verified. Please verify your email to proceed with opening your account.`
const isUserType = () => 'Please select valid User Type!';
const loginFailedErrMsg = (lockTime) => `Your account has been temporarily locked due to multiple unsuccessful login attempts. 
Please try again after ${lockTime} minutes, or reset your password if you've forgotten it.`;
const otpExpireErrorMessage = () => `The OTP has expired. Please request a new one to continue.`;
const otpIncorrectErrorMessage = () => `The OTP you entered is incorrect. Please try again!`;
const imageTypeErrorMessage = () => "Only JPEG, PNG, and GIF images are allowed!";
const requiredImageErrorMessage = () => "Please upload an image!";
const fileSizeErrorMessage = (size) => `You can't able to upload more than ${size} size images!`
const fileCountErrorMessage = (count) => `You can only upload upto ${count} images!`;
const notPermisionErrorMessage = () => `You do not have permission to manipulate this data!`
const updateSuccessMessage = () => `Information Updated Successfully!`;
const ratingErrorMessage = () => `Rating shoulbe be between 1 to 5!`;

const otpSendSuccess = (email) => `An OTP has been sent successfully to your registered email address: ${email}.`;
const forgetPasswordSuccess = () => `Your password reset was successful. You can now log in using your new password.`;
const successEmailVerification = () => `Your email has been successfully verified. Thank you for confirming your email address!`;
const logoutSucess = () => `You have been successfully logged out. We hope to see you again soon!`;

const tokenErrorMessage = (token) => `${token} is not a valid token! `;

module.exports = {
    requiredErrorMessage, validErrorMessage, existErrorMessage, passwordErrorMessage, confirmMatchErrorMessage,
    notExistErrorMessage, notAvailableErrorMessage, availableErrorMessage, expireTokenErrorMessage, emailverficationMessage,
    logErrorMessage, isEmailVerificationErrorMessage, isUserType, loginFailedErrMsg, otpExpireErrorMessage, otpIncorrectErrorMessage,
    imageTypeErrorMessage, requiredImageErrorMessage, fileSizeErrorMessage, fileCountErrorMessage, notPermisionErrorMessage,
    updateSuccessMessage, ratingErrorMessage, otpSendSuccess, forgetPasswordSuccess, successEmailVerification, logoutSucess,
    tokenErrorMessage
};