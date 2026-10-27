const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");

const isSuperAdminExist = async (email, user_type) => {
    const argument = {
        modelName: 'User', methodType: 'findOne', args: { where: { email, user_type }, attributes: ['id'] }
    }
    const isSuperAdmin = await getModelInfo(argument);
    return !isSuperAdmin ? true : false;
}

module.exports = isSuperAdminExist;