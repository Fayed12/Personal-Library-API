// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")
const createErrorObject = require("../../services/errorObject")

const updateBook = async (req, res, next) => {
    const id = req.params.id
    const reqBody = req.body

    if ((!reqBody || Object.keys(reqBody).length === 0)) {
        const err = createErrorObject("please start insert new value to start update!", "failed", 400, true)
        throw err
    }

    if (!checkAllowedFields(reqBody, ["rating", "title", "author", "category", "pages", "pagesRead", "currentPage", "publishedYear", "status"])) {
        const err = createErrorObject("there is some values is not allowed to update", "failed", 400, true)
        throw err
    }

    if (reqBody?.rating > 5 || reqBody?.rating < 0) {
        const err = createErrorObject("rating must be between 0 and 5", "failed", 400, true)
        throw err
    }

    try {
        const book = await Book.findById(id)

        const isSameRating = Number(book.rating.toString()) === Number(reqBody?.rating);
        const isSameTitle = book.title.trim().toLowerCase() === reqBody?.title?.trim().toLowerCase()
        const isSameAuthor = book.author.trim().toLowerCase() === reqBody?.author?.trim().toLowerCase()
        const isSameCategory = book.category.trim().toLowerCase() === reqBody?.category?.trim().toLowerCase()
        const isSamePages = book.pages === reqBody?.pages
        const isSamePagesRead = book.pagesRead === reqBody?.pagesRead
        const isSameCurrentPage = book.currentPage === reqBody?.currentPage
        const isSamePublishedYear = book.publishedYear === reqBody?.publishedYear
        const isSameStatus = book.status === reqBody?.status

        if (isSameRating) {
            const err = createErrorObject("this rating is already exist", "failed", 409, true)
            throw err
        }

        if (isSameTitle) {
            const err = createErrorObject("this title is already exist", "failed", 409, true)
            throw err
        }

        if (isSameAuthor) {
            const err = createErrorObject("this author is already exist", "failed", 409, true)
            throw err
        }

        if (isSameCategory) {
            const err = createErrorObject("this category is already exist", "failed", 409, true)
            throw err
        }

        if (isSamePages) {
            const err = createErrorObject("this pages value is already exist", "failed", 409, true)
            throw err
        }

        if (isSamePagesRead) {
            const err = createErrorObject("this pages read value is already exist", "failed", 409, true)
            throw err
        }

        if (isSameCurrentPage) {
            const err = createErrorObject("this current page value is already exist", "failed", 409, true)
            throw err
        }

        if (isSamePublishedYear) {
            const err = createErrorObject("this published year value is already exist", "failed", 409, true)
            throw err
        }

        if (isSameStatus) {
            const err = createErrorObject("this status value is already exist", "failed", 409, true)
            throw err
        }

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

module.exports = updateBook