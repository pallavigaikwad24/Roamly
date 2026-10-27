const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");

const saveToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(HTTP_CODE.NOT_FOUND.code).send(HTTP_CODE.NOT_FOUND.message);

        const arguments = {
            modelName: 'FirebaseNotificationToken', methodType: "findOne",
            args: { where: { user_id: req.user.id } }
        };
        let existingToken = await getModelInfo(arguments);

        if (existingToken) {
            existingToken.token = token;
            await existingToken.save();
        } else {
            const argument = {
                modelName: 'FirebaseNotificationToken',
                methodType: 'create',
                args: { user_id: req.user.id, token: token }
            }
            existingToken = await getModelInfo(argument);
        }

        return res.status(HTTP_CODE.OK.code).send(existingToken);
    } catch (error) {
        console.error("Error saving token:", error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
};

const getTokenController = async (req, res) => {
    try {
        const arguments = {
            modelName: 'FirebaseNotificationToken', methodType: "findOne",
            args: { where: { user_id: req.user.id } }
        };
        const currToken = await getModelInfo(arguments);

        if (!currToken) {
            return res.status(HTTP_CODE.NOT_FOUND.code).send(HTTP_CODE.NOT_FOUND.message);
        }

        const token = currToken.token;
        return res.status(HTTP_CODE.OK.code).json({ token });
    } catch (error) {
        console.error("Error getting token:", error);
        res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
};

const sendNotification = async (req, res) => {
    try {
        const { token, payload } = req.body;

        const message = { notification: { title: payload.title, body: payload.body }, token: token };
        await getAdminCall(message);

        return res.status(HTTP_CODE.OK.code).send(HTTP_CODE.OK.message);
    } catch (error) {
        console.log("Error while sending notification:", error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
};

module.exports = { getTokenController, saveToken, sendNotification };
