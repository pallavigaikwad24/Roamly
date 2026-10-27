const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const paymentIntegration = require("../../services/paymentIntegration");
const { logErrorMessage } = require("../../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../../services/getModelInfo");

const paymentController = async (req, res) => {
    try {
        const argument = {
            modelName: 'User',
            methodType: 'findOne',
            args: { where: { id: req.user.id }, arguments: ['first_name', 'last_name', 'email', 'phone_number'] }
        };
        const userInfo = await getModelInfo(argument);

        const amount = req.body.amount * 100;
        
        const options = {
            amount,
            currency: process.env.COUNTRY_CODE,
            receipt: userInfo.email
        }

        paymentIntegration.orders.create(options, (err, order) => {
            if (!err) {
               return res.status(HTTP_CODE.OK.code).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount,
                    key_id: process.env.RAZORPAY_ID_KEY,
                    product_name: req.body.name,
                    product_description: req.body.description,
                    contact: userInfo.phone_number,
                    name: `${userInfo.first_name} ${userInfo.last_name}`,
                    email: userInfo.email
                });
            } else {
                return res.status(HTTP_CODE.BAD_REQUEST.code).send({ success: false, msg: HTTP_CODE.BAD_REQUEST.message })
            }
        })
    } catch (error) {
        logger.error(logErrorMessage("Payment Integration"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = paymentController;