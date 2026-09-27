// local
const Book = require("../../schemas/models/bookModel")

const getInconsistentBooks = async (req, res) => {
    
    const books =await Book.find({
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
    if (books.length <= 0) {
        return res.status(200).json({
            status: "failed",
            message: "no data founded"
        })
    }

    res.status(200).json({
        status: "success",
        count: books.length,
        data: books
    })
}

module.exports = getInconsistentBooks