// local
const booksData = require("../../services/readAllBooks")

const getBookByCategory = (req, res) => {
    const category = req.params.category

    if (!category) {
        return res.status(404).json({
            status: "failed",
            message: "please insert category you want!"
        })
    }

    const books = booksData.filter(book => book.category.trim().toLowerCase() === category.trim().toLowerCase())

    if (books.length <= 0) {
        return res.status(404).json({
            status: "failed",
            message: "no data founded, try another category!"
        })
    }

    res.status(200).json({
        status: "success",
        data: books
    })
}

module.exports = getBookByCategory