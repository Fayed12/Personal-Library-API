// local
const Book = require("../../schemas/models/bookModel")

const getBookByCategory = async (req, res) => {
    const category = req.params.category

    if (!category) {
        return res.status(404).json({
            status: "failed",
            message: "please insert category you want!"
        })
    }

    const books = await Book.find({ category })

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