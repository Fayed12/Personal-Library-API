// local
const Book = require("../../schemas/models/bookModel")
const checkAllowedFields = require("../../services/checkAllowedFields")

const updateProgress = async (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    if (!reqBody.pagesRead === undefined) {
        return res.status(400).json({
            status: "failed",
            message: "please insert the new pages Read value!"
        })
    }

    if (!checkAllowedFields(reqBody, ["pagesRead"])) {
        return res.status(404).json({
            status: "failed",
            message: "only pagesRead is allowed to update"
        })
    }

    try {
        const book = await Book.findById(id)

        if (reqBody.pagesRead > book.pages || typeof reqBody.pagesRead !== "number") {
            return res.status(400).json({
                status: "failed",
                message: `please insert correct value or pages lower than book pages: ${book.pages}`
            })
        }

        const isSamePagesRead = book.pagesRead === reqBody.pagesRead

        if (isSamePagesRead) {
            return res.status(404).json({
                status: "failed",
                message: "this value is already exist"
            })
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

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = updateProgress