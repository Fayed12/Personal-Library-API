// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const deleteBulk = async (req, res, next) => {
    const { ids, status, category, maxRating } = req.query

    if (!ids && !status && !category && maxRating === undefined) {
        const err = createErrorObject("please provide at least one filter: [ids, maxRating, category, status]", "failed", 400, true)
        throw err
    }

    const filter = {};

    if (ids) {
        const idsArray = ids
            .split(",")
            .map(id => id.trim())
            .filter(Boolean);

        if (idsArray.length > 20) {
            const err = createErrorObject("you can add ids up to 20", "failed", 400, true)
            throw err
        }

        filter._id = { $in: idsArray };
    }

    if (status) {
        filter.status = status;
    }

    if (category) {
        filter.category = category;
    }

    if (maxRating !== undefined) {
        filter.rating = {
            $lte: maxRating
        };
    }

    try {
        const result = await Book.deleteMany(filter)

        if (result.deletedCount === 0) {
            const err = createErrorObject("process is failed nothing deleted, check your ids", "failed", 500, true)
            throw err
        }

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
}

module.exports = deleteBulk