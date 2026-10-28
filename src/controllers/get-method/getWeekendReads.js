// local
const Book = require("../../schemas/models/bookModel")

const getWeekendReads = async (req, res, next) => {
    const maxPagesNumber = 350

    try {
        const books = await Book.find({
            $nor: [
                { pages: { $gt: maxPagesNumber } },
                { status: "completed" }
            ]
        })

        res.status(200).json({
            status: "success",
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err)
    }
}

module.exports = getWeekendReads