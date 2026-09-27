// local
const Book = require("../../schemas/models/bookModel");

const getBookById = async (req, res) => {
    const id = (req.params.id).trim()

    const book = await Book.findById(id)

    res.status(200).json({
        status: "success",
        book
    })
}

module.exports = getBookById