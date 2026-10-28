// local
const Book = require("../../schemas/models/bookModel")

const getInconsistentBooks = async (req, res, next) => {
    try {
        const books = await Book.find({
            $or: [
                {
                    status: "completed",
                    $expr: { $ne: ["$pagesRead", "$pages"] }
                },
                {
                    status: "planned",
                    $expr: { $gt: ["$pagesRead", 0] }
                }
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

module.exports = getInconsistentBooks