// local
const booksData = require("../../services/readAllBooks")

const getNextUpBooks = (req, res) => {
    const maxPagesNumber = 350

    const books = booksData.filter(book => (book.pages <= maxPagesNumber && book.status !== "planned") || book.status === "reading")

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