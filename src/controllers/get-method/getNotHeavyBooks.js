// local
const Book = require("../../schemas/models/bookModel");
const createErrorObject = require("../../services/errorObject");

const getNotHeavyBooks = async (req, res, next) => {
    const reqQuery = req.query
    const defaultMaxPages = 400

    let limit = defaultMaxPages;
    const reqPagesNumber = Number(reqQuery.maxPages)

    if (typeof reqPagesNumber !== "number") {
        const err = createErrorObject("the limit must be number", "failed", 400, true)
        throw err
    }

    if (reqPagesNumber) {

        if (reqPagesNumber <= 0) {
            const err = createErrorObject("number must be greater than 0", "failed", 400, true)
            throw err
        }

        limit = reqPagesNumber
    }

    try {
        const books = await Book.find({ pages: { $lte: limit } })

        res.status(200).json({
            status: "success",
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getNotHeavyBooks