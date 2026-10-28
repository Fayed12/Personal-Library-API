// local
const Book = require("../../schemas/models/bookModel");
const createErrorObject = require("../../services/errorObject");

const getBookById = async (req, res, next) => {
    const id = (req.params.id).trim()

    try {
        const book = await Book.findById(id)

        if (!book) {

            const err = createErrorObject("no data found", "failed", 404, true)
            throw err
        }

        res.status(200).json({
            status: "success",
            data: book
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getBookById