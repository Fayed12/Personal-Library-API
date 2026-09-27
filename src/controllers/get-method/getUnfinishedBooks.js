// local
const Book = require("../../schemas/models/bookModel")

const getUnfinishedBooks = async (req, res) => {

    const books = await Book.find({
        pagesRead: { $gt: 0 },
        $expr: { $lt: ["$pagesRead", "$pages"] }
    })

    if (books.length <= 0) {
        return res.status(200).json({
            status: "failed",
            message: "no data founded, all books is not started yet or completed!"
        })
    }

    res.status(200).json({
        status: "success",
        count: books.length,
        data: books
    })
}

module.exports = getUnfinishedBooks