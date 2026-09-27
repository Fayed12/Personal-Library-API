// local
const Book = require("../../schemas/models/bookModel")

const getAllBooks = async (req, res) => {
    const { category, status, author, notStatus } = req.query

    let filter = {}
    if (category) filter.category = {
        $regex: category.trim(),
        $options: "i"
    }
    if (status) filter.status = {
        $regex: status.trim(),
        $options: "i"
    }
    if (author) filter.author = {
        $regex: author.trim(),
        $options: "i"
    }
    if (notStatus) filter.status = {
        $not: {
            $regex: `^${notStatus.trim()}$`,
            $options: "i"
        }
    }
    
    const books = await Book.find(filter)

    if (books.length <= 0) {
        return res.status(404).json({
            status: "failed",
            message: "no data founded!"
        })
    }

    res.status(200).json({
        status: "success",
        data: books
    })
}

module.exports = getAllBooks