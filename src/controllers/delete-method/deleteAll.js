// local
const Book = require("../../schemas/models/bookModel")
const createErrorObject = require("../../services/errorObject")

const deleteAll = async (req, res, next) => {
    const confirm = req.query.confirm === "true"

    if (!confirm) {
        const err = createErrorObject("actions denied because you not confirm the delete all action", "failed", 400, true)
        throw err
    }

    try {
        const result = await Book.deleteMany({})

        if (result.deletedCount === 0) {
            const err = createErrorObject("process is failed, nothing deleted, it might be there is not data found", "failed", 500, true)
            throw err
        }

        res.status(204).send()
    } catch (err) {
        next(err)
    }
}


module.exports = deleteAll