// local
const booksData = require("../../services/readAllBooks");

const getBookById = (req, res) => {
    const id = req.params.id

    const book = booksData.find((book => book.id === id.trim()))

    res.status(200).json({
        status: "success",
        book
    })
}

module.exports = getBookById