// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const createNewBook = async (req, res, next) => {
    try {
        const reqBody = req.body

        if (reqBody._id || reqBody.id) {
            const err = createErrorObject("you not allowed to send id with your object!", "failed", 400, true)
            throw err
        }

        const book = await Book.create(reqBody)

        res.status(201).json({
            status: "success",
            location: `get /api/books/${book._id}`,
            message: {
                data: book
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = createNewBook