const { Op, where, fn, col } = require("sequelize");
const HTTP_CODE = require("./enum");
const getModelInfo = require("./getModelInfo");

const filterService = async (filterDate) => {

    if (!filterDate) return res.status(HTTP_CODE.NOT_FOUND.code).send(HTTP_CODE.NOT_FOUND.message);

    const whereConditions = [];

    if (filterDate.search_text) {
        const search = filterDate.search_text;
        whereConditions.push({
            [Op.or]: [
                where(fn('LOWER', col('name')), { [Op.like]: `%${search.toLowerCase()}%` }),
                where(fn('LOWER', col('country')), { [Op.like]: `%${search.toLowerCase()}%` }),
                where(fn('LOWER', col('location')), { [Op.like]: `%${search.toLowerCase()}%` }),
            ],
        })
    }

    if (filterDate.price) {
        whereConditions.push({
            price_per_night: {
                [Op.between]: [JSON.parse(filterDate.price).leastPrice, JSON.parse(filterDate.price).selectedPrice]
            }
        })
    }

    if (filterDate.country && filterDate.country.length > 0) {
        whereConditions.push({
            [Op.or]: JSON.parse(filterDate.country).map(item =>
                where(fn('LOWER', col('country')), { [Op.like]: `%${item.toLowerCase()}%` }),
            )
        })
    }

    if (filterDate.location && filterDate.location.length > 0) {
        whereConditions.push({
            [Op.or]: JSON.parse(filterDate.location).map(item =>
                where(fn('LOWER', col('location')), { [Op.like]: `%${item.toLowerCase()}%` }),
            )
        })
    }

    const argument = { modelName: 'HotelModel', methodType: 'findAll', args: { where: { [Op.and]: whereConditions } } }
    const allResult = await getModelInfo(argument);
    return allResult;
}

module.exports = filterService;