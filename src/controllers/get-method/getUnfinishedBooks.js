// local
const Book = require("../../schemas/models/bookModel")

const getUnfinishedBooks = async (req, res, next) => {
    try {
        const books = await Book.find({
            pagesRead: { $gt: 0 },
            $expr: { $lt: ["$pagesRead", "$pages"] }
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

module.exports = getUnfinishedBooks