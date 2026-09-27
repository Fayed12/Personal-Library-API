// local
const Book = require("../../schemas/models/bookModel")

const createNewBook = async (req, res) => {
    try {
        const reqBody = req.body

        if (reqBody._id) {
            return res.status(400).json({
                status: "failed",
                message: "you not allowed to send id with your object!"
            })
        }

        const book = await Book.create(reqBody)

        res.status(201).json({
            status: "success",
            location: `get /api/books/${book._id}`,
            message: {
                data: book
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

module.exports = createNewBook