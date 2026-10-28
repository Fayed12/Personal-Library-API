// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const updateTags = async (req, res, next) => {
    const reqQuery = req.query
    const { id } = req.params

    if (!reqQuery || Object.entries(reqQuery).length === 0) {
        const err = createErrorObject("please insert your tags", "failed", 400, true)
        throw err
    }

    try {
        const tags = reqQuery?.tags?.split(",").map(tag => tag.trim()).filter(Boolean);

        const book = await Book.findByIdAndUpdate(id, {
            $addToSet:
            {
                tags:
                {
                    $each: tags
                }
            }
        }, { runValidators: true, returnDocument: "after" })

        if (!book) {
            const err = createErrorObject("No book found", "failed", 404, true)
            throw err
        }

        res.status(200).json({
            status: "success",
            location: `get /api/books/${book._id}`,
            message: book
        })
    } catch (err) {
        next(err)
    }
}

module.exports = updateTags