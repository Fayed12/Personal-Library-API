// local
const booksData = require("../../services/readAllBooks")

const getUnfinishedBooks = (req, res) => {

    const books = booksData.filter(book => book.pagesRead < book.pages)

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