// local
const booksData = require("../../services/readAllBooks")

const getMustReadsBooks = (req, res) => {
    const rate = 4.5

    const books = booksData.filter(book => book.rating >= rate && book.status === "completed")

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