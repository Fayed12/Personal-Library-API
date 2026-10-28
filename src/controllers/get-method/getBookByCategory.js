// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const getBookByCategory = async (req, res, next) => {
    const categoryParams = req.params.category
    const category = {
        $regex: new RegExp(`^${categoryParams}`),
        $options: "i"
    }

    if (!category) {
        const err = createErrorObject("please insert category you want!", "failed", 400, true)
        throw err
    }

    try {
        const books = await Book.find({ category });

        res.status(200).json({
            status: "success",
            count: books.length,
            data: books
        });
    } catch (error) {
        next(err)
    }
}

module.exports = getBookByCategory