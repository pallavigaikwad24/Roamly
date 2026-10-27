const HTTP_CODE = require("../../services/enum");
const bcrypt = require("bcrypt");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const emailVerificationHtmlTemplate = require("../../utils/emailVerificationHtmlTemplate");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../../email/emailSend");
const { emailverficationMessage, logErrorMessage } = require("../../services/staticMessage");

const registrationController = async (req, res) => {
    try {
        const { first_name, last_name, email, password, country, phone_number, user_type } = req.body;
        const token = uuidv4();
        sendMail(
            email,
            "Welcome to Our App!",
            `Hello ${first_name, " ", last_name},\n\nThank you for signing up with us! To complete your registration, 
            \n\nplease verify your email address by clicking the button below.`,
            emailVerificationHtmlTemplate(req.headers.host, token)
        );

        const argument = {
            modelName: 'User',
            methodType: 'create',
            args: { first_name, last_name, email, password: bcrypt.hashSync(password, 10), country, phone_number, user_type }
        }
        const newUser = await getModelInfo(argument);

        const tokenArgument = {
            modelName: 'EmailVerificationToken',
            methodType: 'findOrCreate',
            args: { where: { user_id: newUser?.id, is_deleted: false }, defaults: { token: token } }
        }
        const [newToken, createToken] = await getModelInfo(tokenArgument);

        if (!createToken) {
            newToken.token = token
            await newToken.save();
        }

        if (!newUser.is_verified) return res.status(HTTP_CODE.ACCEPTED.code)
            .send({ msg: emailverficationMessage("Email", "Registration") });
        return res.status(HTTP_CODE.ACCEPTED.code).send(newUser);
    } catch (error) {
        logger.error(logErrorMessage("Registration"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = registrationController;