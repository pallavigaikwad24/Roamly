function getUserInfo(value, param) {
    const arguments = {
        modelName: 'User',
        methodType: "findOne",
        args: { where: { [param]: value } }
    }
    return arguments;
}

module.exports = { getUserInfo }