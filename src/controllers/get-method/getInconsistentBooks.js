// local
const booksData = require("../../services/readAllBooks")

const getInconsistentBooks = (req, res) => {

    const books = booksData.filter(book => (book.status === "completed" && book.pagesRead !== book.pages) || (book.status === "planned " && book.pagesRead > 0))

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