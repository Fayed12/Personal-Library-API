// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")
const createErrorObject = require("../../services/errorObject")

const updateRating = async (req, res,next) => {
    const id = req.params.id
    const reqBody = req.body

    if (reqBody.rating === undefined) {
        const err = createErrorObject("please insert the new rating value!", "failed", 400, true)
        throw err
    }

    if (!checkAllowedFields(reqBody, ["rating"])) {
        const err = createErrorObject("only rating is allowed to update", "failed", 400, true)
        throw err
    }

    if (Number(reqBody.rating) > 5 || Number(reqBody.rating) < 0) {
        const err = createErrorObject("rating must be between 0 and 5", "failed", 400, true)
        throw err
    }

    try {
        const book = await Book.findById(id)
        const isSameRating = Number(book.rating) === Number(reqBody.rating)

        if (isSameRating) {
            const err = createErrorObject("this value is already exist", "failed", 400, true)
            throw err
        }

        const newBook = await Book.findByIdAndUpdate(id, reqBody,
            {
                returnDocument: "after",
                runValidators: true
            })

        res.status(200).json({
            status: "success",
            location: `get /api/books/${newBook._id}`,
            message: {
                data: newBook
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = updateRating