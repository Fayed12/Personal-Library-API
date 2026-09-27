// local
const Book = require("../../schemas/models/bookModel")

const getMustReadsBooks =async (req, res) => {
    const rate = 4.5

    const books = await Book.find({
        $expr: { $gte: ["$rating", rate] },
        status: "completed"
    })

    if (books.length <= 0) {
        return res.status(200).json({
            status: "failed",
            message: "no data founded, or all books you read is under 4.5 in rating"
        })
    }

    res.status(200).json({
        status: "success",
        count: books.length,
        data: books
    })
}

module.exports = getMustReadsBooks