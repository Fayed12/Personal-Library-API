// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")
const createErrorObject = require("../../services/errorObject")

const updateAllBook = async (req, res, next) => {
    const id = req.params.id
    const reqBody = req.body

    try {
        if (!checkAllowedFields(reqBody, ["rating", "title", "author", "category", "pages", "pagesRead", "currentPage", "publishedYear", "status"])) {
            const err = createErrorObject("there is some values is not allowed to update", "failed", 400, true)
            throw err
        }

        if (
            reqBody.title === undefined ||
            reqBody.author === undefined ||
            reqBody.category === undefined ||
            reqBody.pages === undefined ||
            reqBody.pagesRead === undefined ||
            reqBody.currentPage === undefined ||
            reqBody.rating === undefined ||
            reqBody.status === undefined ||
            reqBody.publishedYear === undefined
        ) {
            const err = createErrorObject("this object is missing some values, you must follow book schema guide", "failed", 400, true)
            throw err
        }

        await Book.findById(req.params.id);

        Object.assign(book, reqBody)

        await book.save()

        res.status(200).json({
            status: "success",
            location: `get /api/books/${book.id}`,
            message: {
                data: book
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = updateAllBook