// local
const Book = require("../../schemas/models/bookModel")

const getNextUpBooks =async (req, res) => {
    const maxPagesNumber = 350

    const books = await Book.find({
        $or: [
            { $and: [{ $expr: { $lte: ["$pages", maxPagesNumber] } }, { status: "planned" }] },
            {status: "reading"}
        ]
    })
    
    if (books.length <= 0) {
        return res.status(200).json({
            status: "failed",
            message: "no data founded, it might be all books is bigger than 350 pages or no start reading yet !"
        })
    }

    res.status(200).json({
        status: "success",
        count: books.length,
        data: books
    })
}

module.exports = getNextUpBooks