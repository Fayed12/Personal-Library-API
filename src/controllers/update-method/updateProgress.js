// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")

const updateProgress = async (req, res, next) => {
    const id = req.params.id
    const reqBody = req.body

    if (!reqBody.pagesRead === undefined) {
        const err = createErrorObject("please insert the new pages Read value!", "failed", 400, true)
        throw err
    }

    if (!checkAllowedFields(reqBody, ["pagesRead"])) {
        const err = createErrorObject("only pagesRead is allowed to update", 400, true)
        throw err
    }

    try {
        const book = await Book.findById(id)

        if (reqBody.pagesRead > book.pages || typeof reqBody.pagesRead !== "number") {
            const err = createErrorObject(`please insert correct value or pages lower than book pages: ${book.pages}`, "failed", 400, true)
            throw err
        }

        const isSamePagesRead = book.pagesRead === reqBody.pagesRead

        if (isSamePagesRead) {
            const err = createErrorObject("this value is already exist", "failed", 400, true)
            throw err
        }

        let newStatusValue = {}
        if (reqBody.pagesRead === 0) {
            newStatusValue = { status: "planned", pagesRead: reqBody.pagesRead, currentPage: 0 }
        } else if (0 < reqBody.pagesRead && reqBody.pagesRead < book.pages) {
            newStatusValue = { status: "reading", pagesRead: reqBody.pagesRead, currentPage: reqBody.pagesRead }
        } else if (reqBody.pagesRead === book.pages) {
            newStatusValue = { status: "completed", pagesRead: reqBody.pagesRead, currentPage: reqBody.pagesRead }
        }

        Object.assign(book, newStatusValue)

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

module.exports = updateProgress