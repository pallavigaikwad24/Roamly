const findOneHotelArgs = (value, param) => {
    const arguments = {
        modelName: param == 'hotel_id' ? 'HotelModel' : 'FlightModel',
        methodType: 'findOne',
        args: { where: { id: value } }
    }

    return arguments;
}

module.exports = findOneHotelArgs;