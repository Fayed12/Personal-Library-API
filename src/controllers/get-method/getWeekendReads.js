// local
const Book = require("../../schemas/models/bookModel")

const getWeekendReads = async (req, res) => {
    const maxPagesNumber = 350

    const books = await Book.find({
        $nor: [
            { pages: { $gt: maxPagesNumber } },
            { status: "completed" }
        ]
    })

    if (books.length <= 0) {
        return res.status(200).json({
            status: "failed",
            message: "no data founded, or all books you read is bigger than 350 pages"
        })
    }

    res.status(200).json({
        status: "success",
        count: books.length,
        data: books
    })
}

module.exports = getWeekendReads