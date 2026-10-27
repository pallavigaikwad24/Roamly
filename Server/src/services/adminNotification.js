const admin = require("../utils/firebaseAdmin");
const HTTP_CODE = require("./enum");

const getAdminCall = async (message) => {
    await admin.messaging().send(message).then((response) => { console.log("Notification sent successfully:", response); })
        .catch((err) => {
            console.log("Error while sending notification!!!", err);
        });
}

module.exports = { getAdminCall };