// local
const booksData = require("../../services/readAllBooks")

const getAllBooks = (req, res) => {
    const reqQuery = req.query

    let results = booksData

    if (reqQuery?.category) {

        const books = results.filter(book => book.category.trim().toLowerCase() === reqQuery.category.trim().toLowerCase())

        results = books
    }

    if (reqQuery?.status) {
        const books = results.filter(book => book.status.trim() === reqQuery.status.trim())

        results = books
    }

    if (reqQuery?.author) {
        const books = results.filter(book => book.author.trim().toLowerCase() === reqQuery.author.trim().toLowerCase())

        results = books
    }

    if (reqQuery?.notStatus) {
        const books = results.filter(book => book.status.trim() !== reqQuery.notStatus.trim())

        results = books
    }

    if (results.length <= 0) {
        return res.status(404).json({
            status: "failed",
            message: "no data founded, try another category!"
        })
    }

    // projection is incomplete
    // sort, limit, and skip is incomplete

    res.status(200).json({
        status: "success",
        data: results
    })
}

module.exports = getAllBooks