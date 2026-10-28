// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const deleteOne = async (req, res, next) => {
    const { id } = req.params

    try {

        const book = await Book.findByIdAndDelete(id, {
            projection: {
                title: 1,
                author: 1,
                pages: 1,
                status: 1,
            }
        })

        if (!book) {
            const err = createErrorObject("book not found", "failed", 404, true)
            throw err
        }

        res.status(200).json({
            status: "success",
            message: {
                data: book
            }
        })

    } catch (err) {
        next(err)
    }
}

module.exports = deleteOne