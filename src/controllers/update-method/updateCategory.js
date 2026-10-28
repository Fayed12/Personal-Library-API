// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const updateCategory = async (req, res, next) => {
    const { from, to } = req.body

    if (!from || !to) {
        const err = createErrorObject("please insert from and to data object", "failed", 400, true)
        throw err
    }

    try {
        const result = await Book.updateMany({ category: { $regex: from.trim().toLowerCase(), $options: "i" } }, { $set: { category: to } }, { runValidators: true })

        if (result.matchedCount === 0) {
            const err = createErrorObject("No books found", "failed", 404, true)
            throw err
        }

        res.status(200).json({
            status: "success",
            message: "data updated successfully"
        })
    } catch (err) {
        next(err)
    }
}

module.exports = updateCategory