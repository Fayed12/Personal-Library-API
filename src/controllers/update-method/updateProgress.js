// local
const checkAllowedFields = require("../../services/checkAllowedFields")
const booksData = require("../../services/readAllBooks")

// node
const fs = require("node:fs")

const updateProgress = (req, res) => {
    const id = req.params.id
    const reqBody = req.body

    const book = booksData.find((book => book.id === id.trim()))

    if (!reqBody.pagesRead == undefined) {
        return res.status(404).json({
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

    fs.writeFile(`${__dirname}/../../../booksData.json`, JSON.stringify(booksData), (err) => {
        if (err) {
            res.status(404).json({
                status: "failed",
                message: "something went wrong!"
            })
        } else {
            res.status(200).json({
                status: "success",
                location: `get /api/books/${book.id}`,
                message: {
                    data: book
                }
            })
        }
    })
}

module.exports = updateProgress